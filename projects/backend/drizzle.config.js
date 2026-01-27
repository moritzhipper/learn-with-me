"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var drizzle_kit_1 = require("drizzle-kit");
var environment_1 = require("./src/environment");
exports.default = (0, drizzle_kit_1.defineConfig)({
    out: './projects/backend/migrations',
    schema: './projects/backend/src/db/schema.ts',
    breakpoints: false,
    dialect: 'postgresql',
    dbCredentials: {
        url: environment_1.env.DB_URL
    }
});
