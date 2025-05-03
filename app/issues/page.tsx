import prisma from '@/prisma/client';
import { Flex, Table } from '@radix-ui/themes';
import IssueStatusBadge from '../components/IssueStatusBadge';
import IssueStatusFilter from '../issues/IssueStatusFilter';
import Link from '../components/Link';
import { Status } from '@prisma/client';
import IssueActions from './IssueActions';

interface Props {
  searchParams: Promise<{ status?: string }>
}

export const dynamic = 'force-dynamic'

export default async function IssuesPage({ searchParams }: Props) {
  const sp = await searchParams

  const raw = sp.status
  const valid = Object.values<Status>(Status)
  const statusFilter = raw && valid.includes(raw as Status)
    ? (raw as Status)
    : undefined

  const issues = await prisma.issue.findMany(
    statusFilter
      ? { where: { status: statusFilter } }
      : undefined
  )

  return (
    <div>
      <IssueActions />
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
  )
}