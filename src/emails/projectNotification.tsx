import type { projectFormType } from "~/types";

type notificationProps = projectFormType & {
	formName: string
}

export function ProjectNotification({
	description,
	email,
	requiresApproval,
	title,
	username,
	formName
} : notificationProps) {
	return (
		<div>
			<h1>You have received a new project for {formName} form</h1>
			<div>
				<p>Project title: {title}</p>
				<p>Submitted by: {username}; email: {email}</p>
				<p>Project description: {description}</p>
				{requiresApproval && <p>{username} has requested approval for this project</p>}
			</div>
		</div>
	);
}