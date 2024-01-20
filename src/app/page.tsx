import Link from "next/link";
import { SignOutButton } from "~/components/auth/signOutButton";
import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";

export default async function HomePage() {
	const session = await getServerAuthSession();
	return (
		<div className="h-full w-full flex flex-col justify-center items-center">
			{session ? (
				<SignOutButton />
			) : (
				<Button asChild>
					<Link href="/sign-in">Sign in</Link>
				</Button>
			)}
			{session && `Logged in as ${session.user.name}`}
		</div>
	);
}