import { api } from "~/trpc/server";
import { StatusSelector } from "./_projectComponents/statusSelector";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { ArrowRight, Dot } from "lucide-react";
import dayjs from "dayjs"; 
import relativeTime from "dayjs/plugin/relativeTime";
import { AddUpdateButton } from "./_updateComponents/addUpdateForm";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { NonNotifyingUpdate, NotifyingUpdate } from "./_updateComponents/updateCards";
import { EditableTitleField } from "./_projectComponents/editableTitle";
import * as React from "react"

dayjs.extend(relativeTime);

export default async function ProjectPage({ params } : { params: { projectUrl: string }}) {

	const session = await getServerAuthSession();
	if(!session)
		redirect('/sign-in');

	const { project, permission } = await api.project.getProjectByUrl.query({ projectUrl: params.projectUrl });
	const updates = await api.updates.getUpdatesByProjectId.query({ projectId: project.id })

	return (
		<div className="w-full flex flex-col lg:flex-row relative">
			<section id="project-details" className="lg:w-1/2 p-7 flex flex-col gap-3">
				<EditableTitleField title={project.title} permission={permission} projectId={project.id}/>
				<div className="flex flex-row items-center">
					<p className="text-muted-foreground">Submitted {dayjs(project.createdAt).fromNow()}</p>
					<Dot className="text-muted-foreground"/>
					<p className="text-muted-foreground">Last update: {dayjs(project.lastUpdated).fromNow()}</p>
				</div>
				<div className="flex flex-row gap-2">
					{permission !== 'viewer' && <StatusSelector defaultStatus={project.status} projectId={project.id} />}
					<Button asChild variant='outline' className="font-semibold gap-2">
						<Link href={`/form/${project.formUrl}`}>Go to form <ArrowRight className="font-normal h-5 w-5" /></Link>
					</Button>
				</div>
				<h2 className="text-xl font-bold pt-3">Project details</h2>
				<p>
					<b>Project description:</b>
					{"  "}{project.description}
				</p>
				<p><b>Submitted by: </b>{project.username}</p>
				<p><b>Email: </b><a href={`mailto:${project.email}`} className="hover:underline">{project.email}</a></p>
				{project.requiresApproval && <b>This project requires approval before it can be closed</b>}
				{project.receiveUpdates && <b>Update notifications have been turned on for this project</b>}
			</section>
			<section className="grow p-7">
				<h1 className="text-3xl font-semibold pb-4">Project updates</h1>
				{permission !== 'viewer' && (
					<div className="pb-4">
						<AddUpdateButton projectId={project.id} />
					</div>
				)}
				{updates.map(update => (
					<React.Fragment key={update.id}>
						{update.notificationType === 'notifying' ? (
							<NotifyingUpdate update={update} permission={permission} />
						) : (
							<NonNotifyingUpdate update={update} />
						)}
						<div className="w-full flex items-center justify-center last:hidden">
							<div className="h-4 w-px px-px bg-border"></div>
						</div>
					</React.Fragment>
				))}
			</section>
		</div>
	);
}