'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ResponsiveDialog } from "~/components/ui/responsiveDialog";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";

type AddButtonProps = {
	projectId: string,
}

type formProps = {
	projectId: string,
	onSuccess: () => void
}

export function AddUpdateButton({ projectId } : AddButtonProps) {
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const onUploadSuccess = () => {
		setOpen(false);
		router.refresh();
	}

	return (
		<>
			<Card
				className="flex flex-col justify-center items-center px-4 py-6 w-full border-dashed border-zinc-600 cursor-pointer"
				onClick={() => setOpen(true)}
			>
				<Plus className="h-8 w-8"/>
				Add an update
			</Card>
			<ResponsiveDialog
				open={open}
				onOpenChange={setOpen}
				title="Add an update"
			>
				<AddUpdateForm projectId={projectId} onSuccess={onUploadSuccess} />
			</ResponsiveDialog>
		</>
	);
}

function AddUpdateForm({ projectId, onSuccess } : formProps) {
	const { mutate } = api.updates.addUpdate.useMutation({ onSuccess });
	const updateParser = z.object({
		title: z.string().min(1, 'Title is required'),
		notes: z.string().optional()
	});
	const form = useForm<z.infer<typeof updateParser>>({
		defaultValues: {
			notes: '',
			title: ''
		},
		resolver: zodResolver(updateParser)
	});
	const addUpdateSubmit: SubmitHandler<z.infer<typeof updateParser>> = (values) => {
		mutate({...values, projectId, notificationType: 'notifying'})
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(addUpdateSubmit)}
				className="h-full flex flex-col gap-2 p-4"
			>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="flex flex-row items-center gap-1">
								Title
								<FormMessage />
							</FormLabel>
							<FormControl>
								<Input
									placeholder="Update title"
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="notes"
					render={({ field }) => (
						<FormItem className="grow flex flex-col">
							<FormLabel>Notes:</FormLabel>
							<FormControl>
								<Textarea
									className="grow"
									placeholder="Write any notes you have about the update here"
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}