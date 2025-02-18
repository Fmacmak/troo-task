import { relations } from "drizzle-orm/relations";
import { roles, rolePermissions, permissions } from "./schema";

export const rolePermissionsRelations = relations(rolePermissions, ({one}) => ({
	role: one(roles, {
		fields: [rolePermissions.roleId],
		references: [roles.id]
	}),
	permission: one(permissions, {
		fields: [rolePermissions.permissionId],
		references: [permissions.id]
	}),
}));

export const rolesRelations = relations(roles, ({many}) => ({
	rolePermissions: many(rolePermissions),
}));

export const permissionsRelations = relations(permissions, ({many}) => ({
	rolePermissions: many(rolePermissions),
}));