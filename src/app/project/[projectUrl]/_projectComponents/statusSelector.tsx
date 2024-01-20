'use client'

import { toast } from "sonner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { api } from "~/trpc/react";
import type { projectStatus } from "~/types";

type StatusSelectorProps = {
	defaultStatus: projectStatus,
	projectId: string
}

const statuses: projectStatus[] = [
	'submitted',
	'scheduled',
	'in progress',
	'awaiting approval',
	'completed',
];

export function StatusSelector({ defaultStatus, projectId } : StatusSelectorProps) {
	const { mutate, isLoading } = api.projects.updateProjectStatus.useMutation({
		onSuccess: () => {
			toast.success('Project status changed successfully')
		},
		onError: () => {
			toast.error('There was an error while changing the status')
		}
	});

	const onSelectionChange = (status: projectStatus) => {
		mutate({ projectId, newStatus: status });
	}

	return (
		<Select defaultValue={defaultStatus} onValueChange={onSelectionChange}>
			<SelectTrigger disabled={isLoading} className="w-fit gap-2 dark:bg-primary text-black font-semibold">
				<SelectValue placeholder="Choose a status" />
			</SelectTrigger>
			<SelectGroup>
				<SelectContent>
				{statuses.map(status => (
						<SelectItem key={status} value={status}>
							{status.split('').map((s,i) => i === 0 ? s.toUpperCase() : s).join('')}
						</SelectItem>
				))}
				</SelectContent>
			</SelectGroup>
		</Select>
	);
}