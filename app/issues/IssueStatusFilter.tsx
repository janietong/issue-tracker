'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Select } from '@radix-ui/themes';
import { Status } from '@prisma/client';

type FilterValue = Status | 'ALL';

const statuses: { label: string; value: FilterValue }[] = [
  { label: 'All',        value: 'ALL' },
  { label: 'Open',       value: 'OPEN' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Closed',     value: 'CLOSED' },
  { label: 'Cancelled',  value: 'CANCELLED' },
];

export default function IssueStatusFilter() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const current = (searchParams.get('status') as FilterValue) ?? 'ALL';

   const onChange = (value: FilterValue) => {
      const params = new URLSearchParams();
  
      if (value !== 'ALL') params.set('status', value);
  
      const orderBy = searchParams.get('orderBy');
      if (orderBy) params.set('orderBy', orderBy);
  
      const queryString = params.toString();
      const href = '/issues' + (queryString ? '?' + queryString : '');
  
      router.push(href);
      router.refresh();
   };

  const currentLabel =
    statuses.find((s) => s.value === current)?.label ?? 'Filter…';

  return (
    <Select.Root value={current} onValueChange={onChange}>
      <Select.Trigger className="mb-4">{currentLabel}</Select.Trigger>
      <Select.Content>
        {statuses.map((s) => (
          <Select.Item key={s.value} value={s.value}>
            {s.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
