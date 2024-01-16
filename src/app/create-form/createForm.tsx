'use client'

import { api } from "~/trpc/react"
import { 
	type SubmitHandler,
	useForm
} from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { createFormParser } from "~/types/zodParsers";
import type { createFormType } from "~/types";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function CreateForm() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const { mutate } = api.forms.createForm.useMutation({
		onSuccess: () => router.push('/dashboard'),
		onError: () => {
			setLoading(false)
			toast.error("There was an error while trying to submit")
		}
	});

	const { register, handleSubmit, formState: { errors } } = useForm<createFormType>({
		resolver: zodResolver(createFormParser)
	});
	const onFormSubmit: SubmitHandler<createFormType> = (values) => {
		setLoading(true);
		mutate({ ...values });
	}

	return (
		<form 
			onSubmit={handleSubmit(onFormSubmit)}
			className="flex flex-col gap-2.5"
		>
			<Label htmlFor="form-title" className="text-base">Form Title</Label>
			<Input
				{...register('title')}
				id="form-title"
			/>
			{errors.title?.message && <p className="text-sm font-semibold text-red-500">{errors.title.message}</p>}
			<Label 
				htmlFor="description"
				className="flex flex-col gap-1"
			>
				<h1 className="text-base">Description</h1>
				<p className="text-muted-foreground font-normal">
					Use this area to describe the purpose for the form, i.e. if the user needs to know any information about what 
					the form is used for.
				</p>
			</Label>
			<Textarea
				{...register('description')}
				id="description"
			/>
			<Button
				type="submit"
				className="w-full"
			>
				{loading ? (
					<Loader2 className="text-blue-500 animate-spin"/>
				) : (
					"Submit"
				)}
			</Button>
		</form>
	);
}