'use client';

import { Status } from '@prisma/client';
import { Select } from '@radix-ui/themes';
import React from 'react';

type FilterValue = Status | 'ALL';

const statuses: { label: string; value: FilterValue }[] = [
  { label: 'All',        value: 'ALL' },
  { label: 'Open',       value: 'OPEN' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Closed',     value: 'CLOSED' },
  { label: 'Cancelled',  value: 'CANCELLED' },
];

const IssueStatusFilter = () => {
  return (
    <Select.Root>
      <Select.Trigger placeholder="Filter by status..." />
      <Select.Content>
        {statuses.map(status => (
          <Select.Item key={status.value} value={status.value}>
            {status.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};

export default IssueStatusFilter;
