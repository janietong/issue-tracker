// components/IssueTable.tsx
import { Table } from '@radix-ui/themes';
import { ArrowUpIcon } from '@radix-ui/react-icons';
import NextLink from 'next/link';
import Link from 'next/link';
import IssueStatusBadge from '../components/IssueStatusBadge';
import { Issue } from '@prisma/client';

type Column = {
  label: string;
  value: keyof Issue;
  className?: string;
};

const columns: Column[] = [
  { label: 'Issue',   value: 'title' },
  { label: 'Status',  value: 'status',    className: 'hidden md:table-cell' },
  { label: 'Created', value: 'createdAt', className: 'hidden md:table-cell' },
];

interface IssueTableProps {
  issues: Issue[];
  statusFilter?: string;
  rawOrderBy?: keyof Issue;
}

export default function IssueTable({
  issues,
  statusFilter,
  rawOrderBy,
}: IssueTableProps) {
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          {columns.map((col) => (
            <Table.ColumnHeaderCell key={col.value} className={col.className}>
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
  );
}
