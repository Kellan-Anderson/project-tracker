import Link from "next/link";
import { SignInWithGithubButton, SignInWithGoogleButton } from "~/components/auth/signInButtons";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { getServerAuthSession } from "~/server/auth";

export default async function SignInPage() {

	const session = await getServerAuthSession();

	return (
		<div className="w-full h-screen flex justify-center items-center">
			<Card className="w-96">
				{session ? (
					<>
						<CardHeader className="items-center">
							<CardTitle>You are signed in</CardTitle>
						</CardHeader>
						<CardContent className="w-full flex justify-center items-center pt-3">
							<Button asChild>
								<Link href="/dashboard">Click here to go to dashboard</Link>
							</Button>
						</CardContent>
					</>
				) : (
					<>
						<CardHeader>
							<CardTitle>Please sign in to continue</CardTitle>
							<CardDescription>
								For security purposes we do not store any passwords. This makes this app less susceptible to cyber 
								attacks and protects your data.
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-3">
							<SignInWithGithubButton />
							<SignInWithGoogleButton />
						</CardContent>
					</>
				)}
			</Card>
		</div>
	);
}