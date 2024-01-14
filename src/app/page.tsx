import Link from "next/link";
import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";

export default async function HomePage() {
	const session = await getServerAuthSession();
	return (
		<div className="h-full w-full flex justify-center items-center">
			{session ? (
				<Button asChild>
					<Link href="api/auth/signout">Sign out</Link>
				</Button>
			) : (
				<Button asChild>
				<Link href="api/auth/signin">Sign in</Link>
			</Button>
			)}
			{session && `Logged in as ${session.user.name}`}
		</div>
	);
}