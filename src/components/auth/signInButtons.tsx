'use client'

import { Button } from "~/components/ui/button";
import Image from "next/image";
import { signIn } from "next-auth/react"

export function SignInWithGithubButton() {
	return (
		<Button
			className="py-6 px-8 gap-2.5 bg-zinc-800 text-white justify-center items-center hover:bg-secondary/90"
			onClick={() => signIn('github')}
		>
			<Image height={24} width={24} src="https://authjs.dev/img/providers/github.svg" alt="Github logo" />
			<span>
				Sign in with GitHub
			</span>
		</Button>
	);
}

export function SignInWithGoogleButton() {
	return (
		<Button
			className="py-6 px-8 gap-2.5 justify-center items-center"
			onClick={() => signIn('google')}
		>
			<Image height={24} width={24} src="https://authjs.dev/img/providers/google.svg" alt="Google logo" />
			<span>
				Sign in with github
			</span>
		</Button>
	);
}