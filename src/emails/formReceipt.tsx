import type { projectFormType } from "~/types"

export function FormReceipt({
	description,
	email,
	receiveUpdates,
	requiresApproval,
	title,
	username
}: projectFormType) {
	return (
		<div>
			<h1>Project receipt for {title}</h1>
			<div>
				<p>Name: {username}</p>
				<p>Email: {email}</p>
				<p>Project description: {description}</p>
				{receiveUpdates && <p>Will receive email updates about the project</p>}
				{requiresApproval && <p>Approval has been requested for this project</p>}
			</div>
		</div>
	)
}