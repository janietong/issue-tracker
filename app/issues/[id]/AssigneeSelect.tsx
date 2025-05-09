'use client'; 

import { Issue, User } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
    const router = useRouter();
    
    const { data: users, error, isLoading } = useUsers()

    if (isLoading) return <Skeleton />;
    if (error) return null;

    const assignIssue = async (userId: string) => {
        await axios.patch(`/api/issues/${issue.id}`, {
            assignedToUserId: userId === "none" ? null : userId,
        }).catch(() => {
            toast.error('Changes could not be saved.');
          });;
        router.refresh();
    }

    return (
        <>
            <Select.Root
                defaultValue={
                    issue.assignedToUserId ?? "none"
                }
                onValueChange={assignIssue}
            >
            <Select.Trigger placeholder="Assign..." />
            <Select.Content>
                <Select.Group>
                <Select.Label>Suggestions</Select.Label>
                <Select.Item value="none">Unassigned</Select.Item>
                    {users?.map((user) => (
                        <Select.Item key={user.id} value={user.id}>
                        {user.name}
                        </Select.Item>
                    ))}
                </Select.Group>
            </Select.Content>
            </Select.Root>
            <Toaster />
        </>
    )
}

const useUsers = () => useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => axios.get('/api/users').then(res => res.data),
    staleTime: 60 * 1000,
    retry: 3
  });

export default AssigneeSelect