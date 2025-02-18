import { pgTable, unique, uuid, text, timestamp, foreignKey, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	fullname: text().notNull(),
	email: text().notNull(),
	password: text().notNull(),
	roleId: uuid("role_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const roles = pgTable("roles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("roles_name_unique").on(table.name),
]);

export const permissions = pgTable("permissions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("permissions_name_unique").on(table.name),
]);

export const companies = pgTable("companies", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyName: text("company_name").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const rolePermissions = pgTable("role_permissions", {
	roleId: uuid("role_id").notNull(),
	permissionId: uuid("permission_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.id],
			name: "role_permissions_role_id_roles_id_fk"
		}),
	foreignKey({
			columns: [table.permissionId],
			foreignColumns: [permissions.id],
			name: "role_permissions_permission_id_permissions_id_fk"
		}),
	primaryKey({ columns: [table.roleId, table.permissionId], name: "role_permissions_role_id_permission_id_pk"}),
]);
