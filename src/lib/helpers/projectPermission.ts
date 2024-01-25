import { and, eq } from "drizzle-orm";
import { db } from "~/server/db";
import { projectsAndUsers } from "~/server/db/schema";
import type { permissions } from "~/types";

type getProjectPermissionProps = {
	projectId: string,
	userId: string
}

type permissionResult = {
	exists: true,
	permission: permissions
} | {
	exists: false
}

export async function getProjectPermission({ projectId, userId } : getProjectPermissionProps): Promise<permissionResult> {
	const permissionRow = await db.query.projectsAndUsers.findFirst({
		where: and(
			eq(projectsAndUsers.userId, userId),
			eq(projectsAndUsers.projectId, projectId)
		)
	});

	if(!permissionRow) return { exists: false }
	
	return { exists: true, permission: permissionRow.permission }
}

type checkPermissionProps = {
	projectId: string,
	userId: string
} & ({
	is: permissions,
	isNot?: undefined
} | {
	isNot: permissions
	is?: undefined
})

export async function checkPermission(props: checkPermissionProps) {
	const permissionRow = await db.query.projectsAndUsers.findFirst({
		where: and(
			eq(projectsAndUsers.userId, props.userId),
			eq(projectsAndUsers.projectId, props.projectId)
		)
	});
	if(!permissionRow) return false;
	if(!props.is) {
		return props.isNot !== permissionRow.permission
	}
	return props.is === permissionRow.permission
}