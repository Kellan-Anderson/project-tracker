'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardPenLine, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	useForm,
	type SubmitHandler,
	type SubmitErrorHandler
} from "react-hook-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import type { projectFormType } from "~/types";
import { projectFormParser } from "~/types/zodParsers";

export type ProjectFormProps = {
	formTitle: string,
	formDescription?: string,
	name?: string,
	email?: string,
	url: string
}

export function ProjectForm({ email, name, formDescription, formTitle, url } : ProjectFormProps) {
	const form = useForm<projectFormType>({
		defaultValues: {
			username: name ?? '',
			email: email ?? '',
			getReceipt: false,
			description: '',
			title: '',
			receiveUpdates: false,
			requiresApproval: false
		},
		resolver: zodResolver(projectFormParser)
	});
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { mutate } = api.project.postProject.useMutation({
		onSuccess: () => router.push('/'),
		onError: (err) => {
			console.error(err);
			setLoading(false);
		}
	})

	const onProjectFormSubmit: SubmitHandler<projectFormType> = (values) => {
		setLoading(true);
		mutate({
			...values,
			formUrl: url
		})
	}
	const onProjectFormError: SubmitErrorHandler<projectFormType> = (values) => {
		console.error({ values })
	}

	return (
		<Form {...form}>
			<form
			 onSubmit={form.handleSubmit(onProjectFormSubmit, onProjectFormError)}
			 className="flex flex-col gap-2"
			>
				<div className="border-b flex flex-row items-center gap-3 pb-2">
					<ClipboardPenLine className="h-8 w-8" />
					<div className="flex flex-col">
						<h1 className="font-bold text-lg">{formTitle}</h1>
						{formDescription && <h1 className="text-muted-foreground text-md">{formDescription}</h1>}
					</div>
				</div>
				<h1 className="font-bold text-lg">Your info</h1>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="flex flex-row items-center gap-1">
								Name
								<FormMessage />
							</FormLabel>
							<FormControl>
								<Input
									placeholder="First and last name"
									disabled={name !== undefined}
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="flex flex-row items-center gap-1">
								Email
								<FormMessage />
							</FormLabel>
							<FormControl>
								<Input
									placeholder="Email"
									disabled={email !== undefined}
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<h1 className="text-lg font-bold">Project info</h1>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="flex flex-row items-center gap-1">
								Project Name
								<FormMessage />
							</FormLabel>
							<FormControl>
								<Input
									placeholder="Project name"
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="flex flex-row items-center gap-1">
								Project Description
								<FormMessage />
							</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Description"
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<Accordion type="single" collapsible>
					<AccordionItem value="extras">
						<AccordionTrigger className="pt-0">
							<h1 className="text-lg font-bold">Extras</h1>
						</AccordionTrigger>
						<AccordionContent className="flex flex-col gap-2">
							<FormField
								control={form.control}
								name="requiresApproval"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>
												Require approval
											</FormLabel>
											<FormDescription>
												Require approval of your project submission before it can be closed
											</FormDescription>
										</div>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="receiveUpdates"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>
												Receive updates
											</FormLabel>
											<FormDescription>
												Get updates about the project
											</FormDescription>
										</div>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="getReceipt"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>
												Get receipt
											</FormLabel>
											<FormDescription>
												Get a receipt of your project submission sent to your email
											</FormDescription>
										</div>
									</FormItem>
								)}
							/>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
				<Button type="submit" className="">
					{loading ? <Loader2 className="animate-spin text-blue-500" /> : "Submit"}
				</Button>
			</form>
		</Form>
	);
}