import { api } from "~/trpc/server";
import { ProjectForm, ProjectFormProps } from "./projectForm";
import { Card } from "~/components/ui/card";
import { getServerAuthSession } from "~/server/auth";

type formPageProps = {
	params: {
		formId: string
	}
}

export default async function FormPage({ params } : formPageProps) {

	const { form } = await api.forms.getFormByUrlId.query({ urlId: params.formId });
	const session = await getServerAuthSession();

	const formProps: ProjectFormProps = {
		formTitle: form.title,
		email: session?.user.email ?? undefined,
		formDescription: form.description,
		name: session?.user.name ?? undefined,
		url: params.formId
	}

	return (
		<div className="w-full h-screen lg:h-fit px-2 py-10 flex justify-center items-center">
			<Card className="p-4 max-w-lg w-full">
				<ProjectForm {...formProps} />
			</Card>
		</div>
	);
}