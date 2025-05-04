import prisma from "@/prisma/client";
import LatestIssues from "./LatestIssues";
import IssueSummary from "./IssueSummary";
import IssueChart from "./IssueChart";
import { Grid, Flex } from "@radix-ui/themes";
import { Metadata } from "next";

export default async function Home() {
const open = await prisma.issue.count({ where: { status: 'OPEN' } });
const inProgress = await prisma.issue.count({ where: { status: 'IN_PROGRESS' } });
const closed = await prisma.issue.count({ where: { status: 'CLOSED' } });
const cancelled = await prisma.issue.count({ where: { status: 'CANCELLED' } });

return (
  <Grid columns={"1"} gap="5">
    <IssueSummary
      open={open}
      inProgress={inProgress}
      closed={closed}
      cancelled={cancelled}
    />
    <LatestIssues />
  </Grid>
);
}

export const dynamic = 'force-dynamic'; 

export const metadata: Metadata = {
title: 'Issue Tracker - Dashboard',
description: 'View a summary of project issues'
};