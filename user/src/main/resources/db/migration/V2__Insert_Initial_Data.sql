-- V2__Insert_Initial_Data.sql
-- Insert initial roles and admin user

-- Insert default roles
INSERT INTO roles (name, description) 
VALUES 
    ('ROLE_ADMIN', 'Administrator role'),
    ('ROLE_USER', 'Standard user role'),
    ('ROLE_MODERATOR', 'Moderator role')
ON CONFLICT (name) DO NOTHING;

-- Insert admin user
-- Password: admin123 (BCrypt hashed)
INSERT INTO users (username, email, password, full_name, status, is_online, created_at, updated_at)
VALUES (
    'admin',
    'admin@webchat.com',
    '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa',
    'System Administrator',
    'ACTIVE',
    false,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (username) DO NOTHING;

-- Get admin user and role IDs
DO $$
DECLARE
    admin_user_id BIGINT;
    admin_role_id BIGINT;
BEGIN
    SELECT id INTO admin_user_id FROM users WHERE username = 'admin';
    SELECT id INTO admin_role_id FROM roles WHERE name = 'ROLE_ADMIN';
    
    -- Assign admin role to admin user
    IF admin_user_id IS NOT NULL AND admin_role_id IS NOT NULL THEN
        INSERT INTO user_roles (user_id, role_id, granted_at)
        VALUES (admin_user_id, admin_role_id, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id, role_id) DO NOTHING;
    END IF;
END $$;
