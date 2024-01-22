import { useScreenSize } from "~/hooks/useScreenSize";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./drawer";

type ResponsiveDialogProps = {
	open: boolean,
	onOpenChange: (arg0: boolean) => void,
	title?: string,
	children?: React.ReactNode
}

export function ResponsiveDialog(props: ResponsiveDialogProps) {

	const size = useScreenSize();
	if(size === 'loading') return <p>This is a test</p>;

	if(size.width >= 1024) return (
		<Dialog {...props}>
			<DialogContent>
				{props.title && (
					<DialogHeader>
						<DialogTitle>{props.title}</DialogTitle>
					</DialogHeader>
				)}
				{props.children}
			</DialogContent>
		</Dialog>
	);

	return (
		<Drawer {...props}>
			<DrawerContent className="h-1/2 px-5 pb-6">
				{props.title && (
					<DrawerHeader>
						<DrawerTitle>{props.title}</DrawerTitle>
					</DrawerHeader>
				)}
				{props.children}
			</DrawerContent>
		</Drawer>
	);
}