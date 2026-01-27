"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
var zod_1 = require("zod");
var EnvironmentSchema = zod_1.default.object({
    DB_URL: zod_1.default.string(),
    PORT: zod_1.default.string().default('3000'),
    LOG_LEVEL: zod_1.default.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
    NODE_ENV: zod_1.default.enum(['development', 'production', 'test']).default('production')
});
exports.env = EnvironmentSchema.parse(process.env);
