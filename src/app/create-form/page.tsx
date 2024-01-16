import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { CreateForm } from "./createForm";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default async function CreateFormPage() {

	const session = await getServerAuthSession();
	if(!session)
		redirect('/sign-in')

	return (
		<div className="w-full h-screen flex justify-center items-center">
			<Card className="w-full max-w-[450px]">
				<CardHeader>
					<CardTitle>Create a form</CardTitle>
				</CardHeader>
				<CardContent>
					<CreateForm/>
				</CardContent>
			</Card>
		</div>
	);
}