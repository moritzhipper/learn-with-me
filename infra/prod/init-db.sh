#!/bin/bash
set -e

echo "Running init-db.sh: Creating users and database..."

# 1. Create users: app, migrator
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER $DB_MIGRATION_USER WITH PASSWORD '$DB_MIGRATION_PASSWORD';
    CREATE USER $DB_APP_USER WITH PASSWORD '$DB_APP_PASSWORD';
    
    CREATE DATABASE $DB_NAME;
    
    GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_MIGRATION_USER;
    GRANT CONNECT ON DATABASE $DB_NAME TO $DB_APP_USER;
EOSQL

# 2. Connect to the NEW database to set specific schema and table permissions
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB_NAME" <<-EOSQL
    -- Grant the migrator full control over the public schema
    GRANT ALL ON SCHEMA public TO $DB_MIGRATION_USER;
    
    -- Grant the app user usage on the schema, plus basic read/write data access
    GRANT USAGE ON SCHEMA public TO $DB_APP_USER;
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO $DB_APP_USER;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO $DB_APP_USER;
    
    -- CRITICAL: Tell Postgres that whenever the migrator makes a NEW table or sequence in the future, 
    -- it should automatically give the app user access to it.
    ALTER DEFAULT PRIVILEGES FOR ROLE $DB_MIGRATION_USER IN SCHEMA public 
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO $DB_APP_USER;
    
    ALTER DEFAULT PRIVILEGES FOR ROLE $DB_MIGRATION_USER IN SCHEMA public 
    GRANT USAGE, SELECT ON SEQUENCES TO $DB_APP_USER;
EOSQL

echo "init-db.sh completed successfully!"