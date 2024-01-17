import { api } from "~/trpc/server";
import { ProjectForm } from "./projectForm";
import { Card } from "~/components/ui/card";

type formPageProps = {
	params: {
		formId: string
	}
}

export default async function FormPage({ params } : formPageProps) {

	const { form } = await api.forms.getFormByUrlId.query({ urlId: params.formId });

	return (
		<div className="w-full h-screen lg:h-fit px-2 py-10 flex justify-center items-center">
			<Card className="p-4 max-w-lg w-full">
				<ProjectForm
					formTitle={form.title}
					formDescription={form.description}
				/>
			</Card>
		</div>
	);
}