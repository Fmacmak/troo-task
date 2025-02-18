-- Insert Roles
INSERT INTO roles (name) VALUES
  ('Super Admin'),
  ('Store Manager'),
  ('Inventory Manager'),
  ('Checkout Operator'),
  ('Finance Manager');

-- Insert Permissions
INSERT INTO permissions (name) VALUES
  -- System Level Permissions
  ('manage_users'),
  ('manage_roles'),
  ('manage_permissions'),
  ('view_system_settings'),
  
  -- Store Management
  ('manage_store_settings'),
  ('view_store_analytics'),
  ('manage_store_policies'),
  
  -- Inventory Permissions
  ('create_inventory'),
  ('update_inventory'),
  ('delete_inventory'),
  ('view_inventory'),
  
  -- Checkout Permissions
  ('process_checkout'),
  ('manage_refunds'),
  ('view_transactions'),
  ('cancel_transactions'),
  
  -- Financial Permissions
  ('view_financial_reports'),
  ('manage_pricing'),
  ('manage_discounts'),
  ('view_revenue_analytics');

-- Assign Permissions to Super Admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE name = 'Super Admin'),
  id
FROM permissions;

-- Assign Permissions to Store Manager
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE name = 'Store Manager'),
  id
FROM permissions 
WHERE name IN (
  'manage_store_settings',
  'view_store_analytics',
  'manage_store_policies',
  'view_inventory',
  'view_transactions',
  'view_financial_reports',
  'manage_pricing',
  'manage_discounts'
);

-- Assign Permissions to Inventory Manager
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE name = 'Inventory Manager'),
  id
FROM permissions 
WHERE name IN (
  'create_inventory',
  'update_inventory',
  'delete_inventory',
  'view_inventory'
);

-- Assign Permissions to Checkout Operator
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE name = 'Checkout Operator'),
  id
FROM permissions 
WHERE name IN (
  'process_checkout',
  'view_inventory',
  'view_transactions'
);

-- Assign Permissions to Finance Manager
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE name = 'Finance Manager'),
  id
FROM permissions 
WHERE name IN (
  'view_financial_reports',
  'manage_pricing',
  'manage_discounts',
  'view_revenue_analytics',
  'view_transactions',
  'manage_refunds'
);

-- Insert a demo company
INSERT INTO companies (company_name)
VALUES ('Demo Marketplace Ltd');

-- Insert a Super Admin user (password: superadmin123)
INSERT INTO users (fullname, email, password, role_id, company_id)
VALUES (
  'John Doe',
  'admin@demo.com',
  '$2a$10$zPzGqOxcyWOBWYd4QMZyZOQqrG9Mx8qxqTZ0Px8QFVk8.9zLKoCrK',
  (SELECT id FROM roles WHERE name = 'Super Admin'),
  (SELECT id FROM companies WHERE company_name = 'Demo Marketplace Ltd')
);