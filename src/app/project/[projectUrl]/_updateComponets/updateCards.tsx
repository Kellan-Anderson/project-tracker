'use client'

import { z } from "zod";
import type { permissions } from "~/types";
import { type updatesSelectSchema } from "~/server/db/schema";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";
import { type SubmitHandler, type Control, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

type UpdateProps = {
	update: z.infer<typeof updatesSelectSchema>,
	permission: permissions
}

const editFormParser = z.object({
	title: z.string().min(0, 'Title is required'),
	notes: z.string().optional()
});

export function NotifyingUpdate({ permission, update } : UpdateProps) {
	const [editMode, setEditMode] = useState(false);
	
	const form = useForm<z.infer<typeof editFormParser>>({
		defaultValues: {
			title: update.title,
			notes: update.notes ?? '',
		},
		resolver: zodResolver(editFormParser)
	});

	const onFormEdit: SubmitHandler<z.infer<typeof editFormParser>> = (values) => {
		console.log({ values });
	}

	return (
		<Card>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onFormEdit)}>
					<CardHeader className="flex flex-row justify-between items-center">
						<div className="flex flex-col justify-center gap-0.5">
							<CardTitle>
								{editMode ? <EditField control={form.control} size="input" /> : update.title}
							</CardTitle>
							{update.isEdited && !editMode && <p className="pt-px text-sm text-muted-foreground font-thin">Edited</p>}
						</div>
						{(permission !== 'viewer' && !editMode) ? (
							<Button
								variant="outline"
								type="button"
								className="p-2"
								onClick={() => setEditMode(!editMode)}
							>
								<Pencil />
							</Button>
						) : (
							<div className="flex flex-row gap-2">
								<Button variant="outline" type="submit" className="bg-blue-500 p-2">
									<Check />
								</Button>
								<Button variant="outline" className="bg-red-500 p-2" onClick={() => setEditMode(false)}>
									<X />
								</Button>
							</div>
						)}
					</CardHeader>
					<CardContent>
						{editMode ? (
							<EditField control={form.control} size="textarea" />
						) : (
							update.notes
						)}
					</CardContent>
				</form>
			</Form>
		</Card>
	);
}


type editFormProps = {
	control: Control<z.infer<typeof editFormParser>>,
	size: 'input' | 'textarea'
}

function EditField({ control, size } : editFormProps) {
	return (
		<FormField 
			control={control}
			name={size === 'textarea' ? "notes" : "title"}
			render={({ field }) => (
				<FormItem>
					<FormMessage />
					<FormControl>
						{size === 'textarea' ? (
							<Textarea
								{...field}
								placeholder="Enter update notes"
							/>
						) : (
							<Input
								{...field}
								placeholder="Title"
							/>
						)}
					</FormControl>
				</FormItem>
			)}
		/>
	);
}