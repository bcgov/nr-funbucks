import * as path from 'path';

export const CONFIG_BASEPATH = path.resolve(__dirname, '../../config');
export const SERVER_CONFIG_BASEPATH = path.resolve(CONFIG_BASEPATH, 'server');
export const TYPE_CONFIG_BASEPATH = path.resolve(CONFIG_BASEPATH, 'type');
export const OUTPUT_BASEPATH = path.resolve(__dirname, '../../output');
export const TEMPLATES_BASEPATH = path.resolve(__dirname, '../../templates');
