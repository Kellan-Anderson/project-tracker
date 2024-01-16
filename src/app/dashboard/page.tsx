import Link from "next/link";
import { redirect } from "next/navigation";
import { Card } from "~/components/ui/card";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function DashboardPage() {

	const session = await getServerAuthSession();
	if(!session)
		redirect('/sign-in');

	const forms = await api.forms.getUsersForms.query();

	return (
		<div>
			<h1>This is the dashboard</h1>
			<div className="flex flex-col gap-2">
				{forms.map(form => (
					<Link href={`/form/${form.urlId}`} key={form.urlId}>
						<Card className="w-fit">
							<h1 className="text-base font-bold">{form.title}</h1>
							<h2 className="text-muted-foreground">{form.description}</h2>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}