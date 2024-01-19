'use client'

import { localStorageAlertParser } from "~/types/zodParsers";
import { Toaster } from "./toaster";
import { useToast } from "./use-toast";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { alertType } from "~/types";

const LOCAL_STORAGE_KEY = 'alert';

export function Alert() {
	const { toast } = useToast();
	
	useEffect(() => {
		const alert = localStorage.getItem(LOCAL_STORAGE_KEY);
		console.log({ alert })
		if(alert) {
			const parsed = localStorageAlertParser.safeParse(JSON.parse(alert));
			if(parsed.success) {
				toast({
					variant: parsed.data.severity === 'error' ? 'destructive' : 'default',
					title: parsed.data.alert.title,
					description: parsed.data.alert.description
				});
				localStorage.removeItem('alert');
			} else {
				console.log('There was an error parsing string from local storage: ', { alert })
			}
		}
	}, [toast]);

	return (
		<>
			<div className="hidden">force-mount</div>
			<Toaster />
		</>
	);
}

export function useAlert() {
	const router = useRouter();
	const { toast } = useToast();
	const alert = (data: alertType) => {
		if(data.navigate) {
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.lsAlert));
			router.push(data.navigate);
		}
		toast({
			variant: data.lsAlert.severity === 'error' ? 'destructive' : 'default',
			title: data.lsAlert.alert.title,
			description: data.lsAlert.alert.description
		})
	}
	return { alert };
}