#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs_1 = require("fs");
const controller_1 = require("./controller");
const logger_1 = __importDefault(require("./logger"));
commander_1.program
    .argument('<file>', 'JSON file to process')
    .option('--encrypt <key>', 'Encrypt the file with the specified key')
    .option('--compress', 'Compress the file')
    .option('--key <key>', 'Key to decrypt the file')
    .action((file, options) => {
    try {
        const data = (0, fs_1.readFileSync)(file, 'utf8');
        let result;
        if (options.encrypt && options.compress) {
            result = (0, controller_1.compressAndEncrypt)(JSON.parse(data), true, true, options.encrypt);
        }
        else if (options.encrypt) {
            result = (0, controller_1.compressAndEncrypt)(JSON.parse(data), false, true, options.encrypt);
        }
        else if (options.compress) {
            result = (0, controller_1.compressAndEncrypt)(JSON.parse(data), true, false);
        }
        else if (options.key) {
            const decryptedData = (0, controller_1.decryptAndDecompress)(JSON.parse(data), options.key);
            result = JSON.stringify(decryptedData, null, 2);
        }
        else {
            throw new Error('Invalid options provided. Use --help for more information.');
        }
        (0, fs_1.writeFileSync)(file, result, 'utf8');
        logger_1.default.info(`Processed file: ${file}`);
    }
    catch (error) {
        logger_1.default.error(`Error processing file: ${error.message}`);
    }
});
commander_1.program.parse(process.argv);
