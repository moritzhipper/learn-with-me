"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var node_postgres_1 = require("drizzle-orm/node-postgres");
var pg_1 = require("pg");
var environment_1 = require("../environment");
var schema = require("./schema");
var pool = new pg_1.Pool({
    connectionString: environment_1.env.DB_URL,
    ssl: environment_1.env.NODE_ENV === 'production'
});
exports.db = (0, node_postgres_1.drizzle)(pool, { schema: schema });
