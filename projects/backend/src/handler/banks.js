"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareBank = exports.increaseDownloadCount = exports.fetchBankById = exports.fetchUserBanks = exports.fetchBanks = void 0;
var drizzle_orm_1 = require("drizzle-orm");
var db_1 = require("../db/db");
var schema_1 = require("../db/schema");
var fetchBanks = function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getBanksQuery()
                    .where(mapParamsToWhereClause(req.query))
                    .orderBy(req.query.sortBy === 'new' ? (0, drizzle_orm_1.desc)(schema_1.banks.created_at) : (0, drizzle_orm_1.desc)((0, drizzle_orm_1.count)(schema_1.downloadCounts.bank_id)))
                    .limit(req.query.limit)
                    .offset(req.query.offset || 0)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result.map(mapResultToBankShareViaDB)];
        }
    });
}); };
exports.fetchBanks = fetchBanks;
var fetchUserBanks = function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getBanksQuery()
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.banks.user_id, req.userID), (0, drizzle_orm_1.or)((0, drizzle_orm_1.gt)(schema_1.banks.expires, new Date()), (0, drizzle_orm_1.isNull)(schema_1.banks.expires))))
                    .orderBy((0, drizzle_orm_1.desc)(schema_1.banks.created_at))];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result.map(mapResultToBankShareViaDB)];
        }
    });
}); };
exports.fetchUserBanks = fetchUserBanks;
var fetchBankById = function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getBanksQuery().where((0, drizzle_orm_1.eq)(schema_1.banks.id, req.params.id))];
            case 1:
                result = _a.sent();
                if (!result || result.length === 0)
                    return [2 /*return*/, null];
                return [2 /*return*/, mapResultToBankShareViaDB(result[0])];
        }
    });
}); };
exports.fetchBankById = fetchBankById;
var increaseDownloadCount = function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, 3, 4]);
                return [4 /*yield*/, db_1.db.insert(schema_1.downloadCounts).values({
                        bank_id: req.params.id,
                        user_id: req.userID
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 4];
            case 2:
                e_1 = _a.sent();
                req.log.error(e_1);
                return [3 /*break*/, 4];
            case 3: return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.increaseDownloadCount = increaseDownloadCount;
var shareBank = function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var expiryDate, _a, config, bank, dbBank, rows, row;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                expiryDate = null;
                _a = req.body, config = _a.config, bank = _a.bank;
                // does this also accomondate for stepping over to the next minute?
                if (config.ttlMinutes) {
                    expiryDate = new Date();
                    expiryDate.setMinutes(expiryDate.getMinutes() + config.ttlMinutes);
                }
                dbBank = {
                    collections: bank.collections,
                    learnables: bank.learnables
                };
                return [4 /*yield*/, db_1.db
                        .insert(schema_1.banks)
                        .values({
                        user_id: req.userID,
                        speaking: bank.language.speaking,
                        learning: bank.language.learning,
                        name: bank.name,
                        bank_json: dbBank,
                        expires: expiryDate,
                        is_community_bank: config.isCommunityBank
                    })
                        .returning({
                        id: schema_1.banks.id
                    })];
            case 1:
                rows = _b.sent();
                row = rows[0];
                if (!row)
                    throw new Error('Insert failed');
                // filter uncool things here?
                return [2 /*return*/, row];
        }
    });
}); };
exports.shareBank = shareBank;
var mapResultToBankShareViaDB = function (_a) {
    var bank = _a.bank, downloadCount = _a.downloadCount;
    return (__assign({ id: bank.id, createdAt: bank.created_at, expires: bank.expires, isCommunityBank: bank.is_community_bank, downloads: downloadCount, language: {
            speaking: bank.speaking,
            learning: bank.learning
        }, name: bank.name }, bank.bank_json));
};
var getBanksQuery = function () {
    return db_1.db
        .select({
        bank: schema_1.banks,
        downloadCount: (0, drizzle_orm_1.count)(schema_1.downloadCounts.bank_id)
    })
        .from(schema_1.banks)
        .leftJoin(schema_1.downloadCounts, (0, drizzle_orm_1.eq)(schema_1.banks.id, schema_1.downloadCounts.bank_id))
        .groupBy(schema_1.banks.id)
        .$dynamic();
};
var mapParamsToWhereClause = function (params) {
    var requestDirectionMatch = (0, drizzle_orm_1.and)(params.speaking ? (0, drizzle_orm_1.ilike)(schema_1.banks.speaking, params.speaking) : undefined, params.learning ? (0, drizzle_orm_1.ilike)(schema_1.banks.learning, params.learning) : undefined);
    var reverseDirectionMatch = (0, drizzle_orm_1.and)(params.speaking ? (0, drizzle_orm_1.ilike)(schema_1.banks.learning, params.speaking) : undefined, params.learning ? (0, drizzle_orm_1.ilike)(schema_1.banks.speaking, params.learning) : undefined);
    return (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.banks.is_community_bank, true), (0, drizzle_orm_1.or)((0, drizzle_orm_1.gt)(schema_1.banks.expires, new Date()), (0, drizzle_orm_1.isNull)(schema_1.banks.expires)), (0, drizzle_orm_1.or)(requestDirectionMatch, reverseDirectionMatch));
};
