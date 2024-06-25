#!/usr/bin/env node

import { program } from 'commander';
import { readFileSync, writeFileSync } from 'fs';
import { compressAndEncrypt, decryptAndDecompress } from './controller';
import logger from './logger';

program
  .argument('<file>', 'JSON file to process')
  .option('--encrypt <key>', 'Encrypt the file with the specified key')
  .option('--compress', 'Compress the file')
  .option('--key <key>', 'Key to decrypt the file')
  .action((file, options) => {
    try {
      const data = readFileSync(file, 'utf8');
      let result: string;

      if (options.encrypt && options.compress) {
        result = compressAndEncrypt(JSON.parse(data), true, true, options.encrypt);
      } else if (options.encrypt) {
        result = compressAndEncrypt(JSON.parse(data), false, true, options.encrypt);
      } else if (options.compress) {
        result = compressAndEncrypt(JSON.parse(data), true, false);
      } else if (options.key) {
        const decryptedData = decryptAndDecompress(JSON.parse(data), options.key);
        result = JSON.stringify(decryptedData, null, 2);
      } else {
        throw new Error('Invalid options provided. Use --help for more information.');
      }

      writeFileSync(file, result, 'utf8');
      logger.info(`Processed file: ${file}`);
    } catch (error) {
      logger.error(`Error processing file: ${(error as Error).message}`);
    }
  });

program.parse(process.argv);
