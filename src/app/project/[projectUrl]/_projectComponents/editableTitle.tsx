'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { 
	type Control,
	type SubmitHandler,
	useForm
} from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import type { permissions } from "~/types";

type EditableTitleFieldProps = {
	title: string,
	permission: permissions,
	projectId: string
}

export function EditableTitleField({ title, permission, projectId } : EditableTitleFieldProps) {
	const [editMode, setEditMode] = useState(false);
	const titleRef = useRef(title);
	const router = useRouter();
	const { mutate } = api.project.updateTitle.useMutation({
		onSuccess: () => {
			router.refresh();
		}
	})

	const form = useForm<z.infer<typeof editTitleParser>>({
		defaultValues: {
			title: title
		},
		resolver: zodResolver(editTitleParser)
	});
	const onEditTitleSubmit: SubmitHandler<z.infer<typeof editTitleParser>> = (values) => {
		if(titleRef.current !== values.title) {
			mutate({ ...values, projectId })
		}
		setEditMode(false)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onEditTitleSubmit)}>
				<div className="flex flex-row justify-between items-center gap-2 group">
					{editMode ? (
						<EditField control={form.control} />
					) : (
						<h1 className="text-5xl font-bold">{title}</h1>
					)}
					{permission !== 'viewer' && <FormButtons {...{editMode, setEditMode}} />}
				</div>
			</form>
		</Form>
	);
}

type formButtonProps = {
	editMode: boolean,
	setEditMode: (arg0: boolean) => void
}

function FormButtons({ editMode, setEditMode } : formButtonProps) {
	if(editMode) return (
		<div className="flex flex-row gap-1">
			<Button
				className="p-2 bg-blue-500 h-12 w-12"
				type="submit"
				variant="outline"
			>
				<Check className="h-7 w-7" />
			</Button>
			<Button
				className="p-2 bg-red-500 h-12 w-12"
				type="button"
				variant="outline"
				onClick={() => setEditMode(false)}
			>
				<X className="h-7 w-7"/>
			</Button>
		</div>
	)

	return (
		<Button
			className="p-2 flex lg:hidden lg:group-hover:flex items-center justify-center"
			variant="outline"
			onClick={() => setEditMode(true)}
		>
			<Pencil />
		</Button>
	)
}


type editFieldProps = {
	control: Control<z.infer<typeof editTitleParser>>
}

function EditField({ control } : editFieldProps) {
	return (
		<FormField
			control={control}
			name="title"
			render={({ field }) => (
				<FormItem className="grow">
					<FormControl>
						<Input
							placeholder="Title"
							className="h-12"
							{...field}
						/>
					</FormControl>
				</FormItem>
			)}
		/>
	)
}

const editTitleParser = z.object({
	title: z.string().min(1, 'Title is required')
});