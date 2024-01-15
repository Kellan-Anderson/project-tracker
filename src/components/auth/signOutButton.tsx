'use client'

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react"

export function SignOutButton() {
	const router = useRouter();

	const onSignOut = async () => {
		await signOut();
		router.push('/')
	}

	return (
		<Button onClick={onSignOut}>
			Sign out
		</Button>
	);
}