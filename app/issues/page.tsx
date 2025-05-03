import prisma from '@/prisma/client';
import { Table } from '@radix-ui/themes';
import IssueStatusBadge from '../components/IssueStatusBadge';
import IssueStatusFilter from '../issues/IssueStatusFilter';
import Link from '../components/Link';
import { Status } from '@prisma/client';

interface Props {
  searchParams: { status?: string };
}

// force-dynamic ensures we always re-run on the server when query changes
export const dynamic = 'force-dynamic';

export default async function IssuesPage({ searchParams }: Props) {
  // pull the raw string out of searchParams
  console.log('🚀 [issues page] hot reload — this file is running!')
  console.log('🚀 [issues page] typeof window:', typeof window)
  console.log('🚀 [issues page] raw searchParams:', searchParams)
  const raw = searchParams.status;

  // only accept it if it matches your enum
  const valid = Object.values<Status>(Status);
  const statusFilter = raw && valid.includes(raw as Status)
    ? (raw as Status)
    : undefined;

  console.log('Filtering for status:', statusFilter ?? 'ALL');

  // if statusFilter is undefined, passing `undefined` returns all rows
  const issues = await prisma.issue.findMany(
    statusFilter
      ? { where: { status: statusFilter } }
      : undefined
  );

  return (
    <div>
      {/* client-side dropdown */}
      <IssueStatusFilter />

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Issue</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Status
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Created
            </Table.ColumnHeaderCell>
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
