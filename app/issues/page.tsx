import prisma from '@/prisma/client';
import IssueTable from './IssueTable';
import IssueActions from './IssueActions';
import Pagination from '@/app/components/Pagination';
import { Issue, Status } from '@prisma/client';
import { Metadata } from "next";

interface Props {
  searchParams: Promise<{
    status?: string;
    orderBy?: string;
    page?: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function IssuesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const { status: rawStatus, orderBy: rawOrderBy, page: rawPage } = sp;

  const isValidStatus = (v: string): v is Status =>
    Object.values(Status).includes(v as Status);
  const statusFilter = rawStatus && isValidStatus(rawStatus) ? rawStatus : undefined;

  const sortable: (keyof Issue)[] = ['title','status','createdAt'];
  const isValidOrderBy = (v: string): v is keyof Issue =>
    sortable.includes(v as keyof Issue);
  const orderByArg = rawOrderBy && isValidOrderBy(rawOrderBy)
    ? { [rawOrderBy]: 'asc' as const }
    : undefined;

  const pageSize = 10;
  const page     = rawPage ? parseInt(rawPage, 10) : 1;
  const totalCount = await prisma.issue.count({
    ...(statusFilter && { where: { status: statusFilter } }),
  });
  const pageCount = Math.ceil(totalCount / pageSize);

  const issues = await prisma.issue.findMany({
    ...(statusFilter && { where: { status: statusFilter } }),
    ...(orderByArg   && { orderBy: orderByArg   }),
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return (
    <div>
      <IssueActions />
      <IssueTable
        issues={issues}
        statusFilter={statusFilter}
        rawOrderBy={isValidOrderBy(rawOrderBy ?? '') ? rawOrderBy as keyof Issue : undefined}
      />
      {pageCount > 1 && (
        <Pagination
          pageSize={pageSize}
          currentPage={page}
          itemCount={totalCount}
        />
      )}
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Issue Tracker - Issues',
  description: 'View all project issues'
};