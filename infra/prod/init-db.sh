#!/bin/bash
set -e

echo "Running init-db.sh: Creating users and configuring database..."
: "${POSTGRES_USER:?POSTGRES_USER is not set in .env}"
: "${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is not set in .env}"


# 1. Create users and assign database ownership
psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" <<-EOSQL
    -- Create the roles
    CREATE USER $DB_USER_MIGRATOR WITH PASSWORD '$DB_PASSWORD_MIGRATOR';
    CREATE USER $DB_USER_APP WITH PASSWORD '$DB_PASSWORD_APP';
    
    -- Make the migrator the absolute owner of the database
    ALTER DATABASE $POSTGRES_DB OWNER TO $DB_USER_MIGRATOR;
    
    -- Let the app user connect
    GRANT CONNECT ON DATABASE $POSTGRES_DB TO $DB_USER_APP;
EOSQL

# 2. Connect to the NEW database to set schema and default permissions
psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Make the migrator the owner of the public schema (crucial for PG15+)
    ALTER SCHEMA public OWNER TO $DB_USER_MIGRATOR;
    
    -- Grant the app user usage on the schema
    GRANT USAGE ON SCHEMA public TO $DB_USER_APP;
    
    -- (Optional) Grant access to any ALREADY EXISTING tables/sequences
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO $DB_USER_APP;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO $DB_USER_APP;
    
    -- CRITICAL: Default privileges for future tables/sequences created by the migrator
    ALTER DEFAULT PRIVILEGES FOR ROLE $DB_USER_MIGRATOR IN SCHEMA public 
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO $DB_USER_APP;
    
    ALTER DEFAULT PRIVILEGES FOR ROLE $DB_USER_MIGRATOR IN SCHEMA public 
    GRANT USAGE, SELECT ON SEQUENCES TO $DB_USER_APP;
EOSQL

echo "init-db.sh completed successfully!"