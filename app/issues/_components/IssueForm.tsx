'use client';

import dynamic from 'next/dynamic';
import 'easymde/dist/easymde.min.css';
import { Button, TextField, Callout } from '@radix-ui/themes';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { IssueSchema } from '@/app/validationSchemas';
import { z } from 'zod';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';
import { Issue } from '@prisma/client';

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
});

type IssueFormData = z.infer<typeof IssueSchema>;

interface Props {
  issue?: Issue;
}

export default function IssueForm({ issue }: Props) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<IssueFormData>({
    resolver: zodResolver(IssueSchema),
    defaultValues: {
      title: issue?.title ?? '',
      description: issue?.description ?? '',
    }
  });

  useEffect(() => {
    if (issue) {
      reset({
        title: issue.title,
        description: issue.description,
      });
    }
  }, [issue, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (issue) {
        setIsSubmitting(true);
        await axios.patch(`/api/issues/${issue.id}`, data);
        router.push('/issues');
      }
    } catch {
      setIsSubmitting(false);
      setError('An unexpected error occurred!');
    }
  });

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField.Root
              placeholder="Title"
              {...field}
            />
          )}
        />
        <ErrorMessage>{errors.title?.message}</ErrorMessage>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <SimpleMDE
              placeholder="Description"
              {...field}
            />
          )}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>

        <Button type="submit" disabled={isSubmitting}>
          {issue ? 'Save Changes' : 'Submit New Issue'}
          {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
}
