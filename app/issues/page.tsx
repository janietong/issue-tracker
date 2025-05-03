import prisma from '@/prisma/client';
import { Flex, Table } from '@radix-ui/themes';
import IssueStatusBadge from '../components/IssueStatusBadge';
import IssueStatusFilter from '../issues/IssueStatusFilter';
import Link from '../components/Link';
import { Issue, Status } from '@prisma/client';
import IssueActions from './IssueActions';
import NextLink from 'next/link';
import { ArrowUpIcon } from "@radix-ui/react-icons";

interface Props {
  searchParams: Promise<{ status?: string; orderBy?: keyof Issue }>;
}

export const dynamic = 'force-dynamic';

export default async function IssuesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const { status: rawStatus, orderBy: rawOrderBy } = sp;

  const isValidStatus = (value: string): value is Status =>
    Object.values(Status).includes(value as Status);
  
  const statusFilter = rawStatus && isValidStatus(rawStatus)
    ? rawStatus
    : undefined;  

  const sortableFields: (keyof Issue)[] = ['title', 'status', 'createdAt'];

  const isValidOrderBy = (value: string): value is keyof Issue =>
    sortableFields.includes(value as keyof Issue);
  
  const orderByArg = rawOrderBy && isValidOrderBy(rawOrderBy)
    ? { [rawOrderBy]: 'asc' as const }
    : undefined;

  const issues = await prisma.issue.findMany({
    ...(statusFilter && { where: { status: statusFilter } }),
    ...(orderByArg && { orderBy: orderByArg }),
  });

  const columns: {
    label: string;
    value: keyof Issue;
    className?: string;
  }[] = [
    { label: 'Issue',   value: 'title' },
    { label: 'Status',  value: 'status',   className: 'hidden md:table-cell' },
    { label: 'Created', value: 'createdAt', className: 'hidden md:table-cell' },
  ];

  return (
    <div>
      <IssueActions />
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            {columns.map((col) => (
              <Table.ColumnHeaderCell
                key={col.value}
                className={col.className}
              >
                <NextLink
                  href={{
                    pathname: '/issues',
                    query: {
                      ...(statusFilter && { status: statusFilter }),
                      orderBy: col.value,
                    },
                  }}
                >
                  {col.label}
                </NextLink>
                {rawOrderBy === col.value && (
                  <ArrowUpIcon className="inline ml-1" />
                )}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                <div className="block md:hidden">
                  <IssueStatusBadge status={issue.status} />
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <IssueStatusBadge status={issue.status} />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {issue.createdAt.toDateString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}