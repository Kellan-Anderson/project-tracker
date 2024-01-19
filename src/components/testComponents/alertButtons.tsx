'use client'

import { useAlert } from "../ui/alert";
import { Button } from "../ui/button";

export function AlertButton() {
	const { alert } = useAlert();
	return (
		<Button
			onClick={() => alert({
				lsAlert: {
					alert: {
						title: 'This is a test',
						description: 'This is a test of the custom use alert hook'
					},
					severity: 'success'
				}
			})}
		>
			Test with redirect
		</Button>
	);
}

export function AlertButtonWithError() {
	const { alert } = useAlert();
	return (
		<Button
			onClick={() => alert({
				lsAlert: {
					alert: {
						title: 'This is an error alert',
						description: 'This should look like an error'
					},
					severity: 'error'
				}
			})}
		>
			Test alert with an error
		</Button>
	);
}

export function AlertButtonWithRedirect() {
	const { alert } = useAlert();
	return (
		<Button
			onClick={() => alert({
				lsAlert: {
					alert: {
						title: 'This is a redirect',
						description: 'This should display after the page redirects'
					},
					severity: 'error'
				},
				navigate: '/dashboard'
			})}
		>
			Test alert
		</Button>
	);
}