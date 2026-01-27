"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloads = exports.banksRelations = exports.downloadCounts = exports.banks = void 0;
var drizzle_orm_1 = require("drizzle-orm");
var pg_core_1 = require("drizzle-orm/pg-core");
// manage some json values as separate columns for indexing and easy querying
exports.banks = (0, pg_core_1.pgTable)('banks', {
    id: (0, pg_core_1.uuid)().primaryKey().defaultRandom(),
    user_id: (0, pg_core_1.uuid)().notNull(),
    name: (0, pg_core_1.varchar)({ length: 512 }).notNull(),
    speaking: (0, pg_core_1.varchar)().notNull(),
    learning: (0, pg_core_1.varchar)().notNull(),
    created_at: (0, pg_core_1.timestamp)().notNull().defaultNow(),
    expires: (0, pg_core_1.timestamp)(),
    is_community_bank: (0, pg_core_1.boolean)().notNull().default(false),
    bank_json: (0, pg_core_1.jsonb)().notNull().$type()
});
exports.downloadCounts = (0, pg_core_1.pgTable)('download_counts', {
    bank_id: (0, pg_core_1.uuid)()
        .references(function () { return exports.banks.id; }, { onDelete: 'cascade' })
        .notNull(),
    user_id: (0, pg_core_1.uuid)().notNull(),
    timestamp: (0, pg_core_1.timestamp)().notNull().defaultNow()
}, function (table) { return [(0, pg_core_1.primaryKey)({ columns: [table.bank_id, table.user_id] })]; });
exports.banksRelations = (0, drizzle_orm_1.relations)(exports.banks, function (_a) {
    var many = _a.many;
    return ({
        downloadCounts: many(exports.downloadCounts)
    });
});
exports.downloads = (0, drizzle_orm_1.relations)(exports.downloadCounts, function (_a) {
    var one = _a.one;
    return ({
        bank: one(exports.banks, {
            fields: [exports.downloadCounts.bank_id],
            references: [exports.banks.id]
        })
    });
});
