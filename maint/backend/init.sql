DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'maintenance.tn') THEN
        CREATE DATABASE "maintenance.tn";
    END IF;
END $$;
