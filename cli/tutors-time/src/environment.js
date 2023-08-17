"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebase = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const result = dotenv_1.default.config();
if (result.error) {
    console.log(result.error.message);
}
exports.firebase = {
    apiKey: process.env.firebase_apiKey,
    databaseURL: process.env.firebase_databaseUrl,
    projectId: process.env.firebase_projectId,
    tutorsStoreId: process.env.tutors_store_id,
    tutorsStoreSecret: process.env.tutors_store_secret,
};
//# sourceMappingURL=environment.js.map