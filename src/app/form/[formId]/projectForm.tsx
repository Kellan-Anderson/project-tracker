'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardPenLine } from "lucide-react";
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
import type { projectFormType } from "~/types";
import { projectFormParser } from "~/types/zodParsers";

type ProjectFormProps = {
	formTitle: string,
	formDescription?: string,
	name?: string,
	email?: string,
}

export function ProjectForm({ email, name, formDescription, formTitle } : ProjectFormProps) {
	const form = useForm<projectFormType>({
		defaultValues: {
			userName: name ?? '',
			userEmail: email ?? '',
			getReceipt: false,
			projectDescription: '',
			projectName: '',
			receiveUpdates: false,
			requiresApproval: false
		},
		resolver: zodResolver(projectFormParser)
	});
	const onProjectFormSubmit: SubmitHandler<projectFormType> = (values) => {
		console.log({ values })
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
					name="userName"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="flex flex-row items-center gap-1">
								Name
								<FormMessage />
							</FormLabel>
							<FormControl>
								<Input placeholder="First and last name" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="userEmail"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="flex flex-row items-center gap-1">
								Email
								<FormMessage />
							</FormLabel>
							<FormControl>
								<Input
									placeholder="Email"
									{...field}
								/>
							</FormControl>
							
						</FormItem>
					)}
				/>
				<h1 className="text-lg font-bold">Project info</h1>
				<FormField
					control={form.control}
					name="projectName"
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
					name="projectDescription"
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
						<AccordionContent>
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
				<Button type="submit" className="">Submit</Button>
			</form>
		</Form>
	);
}

/*

<form onSubmit={handleSubmit(onProjectFormSubmit, onProjectFormError)} className="flex flex-col gap-2">
			
			<div className="px-1 flex flex-col gap-3">
				<Label htmlFor="project-description" className="flex flex-row gap-1">
					Project Description
					{errors.projectDescription?.message && <p className="text-red-500">*{errors.projectDescription.message}</p>}
				</Label>
				<Textarea
					id="project-description"
					placeholder="Description"
					{...register('projectDescription')}
				/>
			</div>
			<h1 className="text-lg font-bold">Extras</h1>
			<div className="px-1 flex flex-col gap-3">
				<div className="flex flex-row gap-1.5">
					<Checkbox id="receive-updates"/>
					<Label htmlFor="receive-updates">Get email updates for the project</Label>
				</div>
				<div className="flex flex-row gap-1.5">
					<Checkbox id="require-approval"/>
					<Label htmlFor="require-approval">Require approval for the project</Label>
				</div>
				<div className="flex flex-row gap-1.5">
					<Checkbox id="receipt"/>
					<Label htmlFor="receipt">Get an email receipt for this project submission</Label>
				</div>
			</div>
			<Button type="submit">Submit</Button>
		</form>

*/