import { api } from "~/trpc/server";
import { StatusSelector } from "./_projectComponents/statusSelector";

export default async function ProjectPage({ params } : { params: { projectUrl: string }}) {
	const { project, permission } = await api.projects.getProjectByUrl.query({ projectUrl: params.projectUrl });
	return (
		<div className="w-full flex flex-col lg:flex-row">
			<section id="project-details" className="w-1/2 lg:sticky lg:top-0 p-7">
				<h1 className="text-5xl font-bold">{project.title}</h1>
				<p>{project.description}</p>
				{permission !== 'viewer' && <StatusSelector defaultStatus={project.status} projectId={project.id} />}
			</section>
			<section>
				Updates coming soon
			</section>
		</div>
	);
}