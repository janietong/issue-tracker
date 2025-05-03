'use client';

import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';
import { IssueSchema } from '@/app/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Issue } from '@prisma/client';
import { Button, Callout, TextField } from '@radix-ui/themes';
import axios from 'axios';
import 'easymde/dist/easymde.min.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import SimpleMDE from 'react-simplemde-editor';
import { z } from 'zod';

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
      setIsSubmitting(true);
      if (issue) {
        await axios.patch(`/api/issues/${issue.id}`, data);
      } else {
        await axios.post(`/api/issues`, data);
      }
      router.push('/issues');
      router.refresh();
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
          {issue ? 'Save Changes' : 'Submit New Issue'}{' '}
          {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
}
