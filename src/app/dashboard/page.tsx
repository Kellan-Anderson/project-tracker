import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export default async function DashboardPage() {

	const session = await getServerAuthSession();
	if(!session)
		redirect('/sign-in')

	return (
		<>This is the dashboard</>
	);
}