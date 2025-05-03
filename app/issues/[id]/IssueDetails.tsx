'use client';

import IssueStatusBadge from '@/app/components/IssueStatusBadge';
import { Issue } from '@prisma/client';
import { Card, Flex, Heading, Text } from '@radix-ui/themes';
import ReactMarkdown from 'react-markdown';

type IssueWithStringDate = Omit<Issue, 'createdAt'> & { createdAt: string };

interface Props {
  issue: IssueWithStringDate;
}

const IssueDetails = ({ issue }: Props) => {
  const createdAt = new Date(issue.createdAt);

  return (
    <>
      <Heading as="h1">{issue.title}</Heading>

      <Flex gap="3" my="2" align="center">
        <IssueStatusBadge status={issue.status} />
        <Text>{createdAt.toDateString()}</Text>
      </Flex>

      <Card className="prose max-w-full mt-4">
        <div className="prose max-w-full prose-zinc dark:prose-invert">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-4xl mb-2">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="font-bold mt-5 mb-2">
                {children}
              </h2>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-6 space-y-1">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-6 space-y-1">
                {children}
              </ol>
            ),
          }}
        >
        {issue.description ?? ''}
</ReactMarkdown>

        </div>
      </Card>
    </>
  );
};

export default IssueDetails;
