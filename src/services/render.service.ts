import * as fs from 'fs';
import * as path from 'path';
import * as nunjucks from 'nunjucks';

import {CONFIG_BASEPATH, OUTPUT_BASEPATH, TEMPLATES_BASEPATH} from '../constants/paths';
import {BaseConfig} from '../util/types';


const baseConfigStr = fs.readFileSync(path.resolve(CONFIG_BASEPATH, `base.json`), 'utf8');
const baseConfig: BaseConfig = JSON.parse(baseConfigStr);

export class RenderService {
  static typeCnt: {
    [type: string]: number
  } = {};
  public static init() {
    nunjucks.configure(TEMPLATES_BASEPATH, {
      autoescape: true,
    });
    this.clean();
  }

  public static clean() {
    fs.rmSync(OUTPUT_BASEPATH, {recursive: true, force: true});
    fs.mkdirSync(OUTPUT_BASEPATH);
  }

  public static writeBase(baseContext: object) {
    const context = {
      ...baseConfig.context,
      ...baseContext,
    };
    this.writeRenderedTemplate('filters.conf.njk', 'filters.conf', context);
    this.writeRenderedTemplate('filters.lua.njk', 'filters.lua', context);
    this.writeRenderedTemplate('fluent-bit.conf.njk', 'fluent-bit.conf', context);
    this.writeRenderedTemplate('outputs.conf.njk', 'outputs.conf', context);
    this.writeRenderedTemplate('parsers.conf.njk', 'parsers.conf', context);
  }

  public static writeType(
    baseContext: object,
    type: string,
    id: string | undefined = undefined) {
    this.typeCnt[type] = this.typeCnt[type] ? this.typeCnt[type] + 1 : 1;
    const typeTag = id ? id : `${type}_${this.typeCnt[type]}`;

    for (const filePath of ['filter/filters.conf.njk', 'input/inputs.conf.njk', 'parser/parsers.conf.njk']) {
      if (!fs.existsSync(path.resolve(TEMPLATES_BASEPATH, type, filePath))) {
        // skip if does not exist
        continue;
      }
      this.writeRenderedTemplate(
        `${type}/${filePath}`,
        `${typeTag}/${filePath}`,
        {
          typeTag,
          ...baseConfig.context,
          ...baseContext,
        });
    }
  }

  public static writeRenderedTemplate(templateName: string, outputPath: string, context: object) {
    const txt = nunjucks.render(templateName, context);
    const outPath = path.resolve(OUTPUT_BASEPATH, outputPath);
    fs.mkdirSync(path.dirname(outPath), {recursive: true});
    fs.writeFileSync(path.resolve(OUTPUT_BASEPATH, outputPath), txt);
  }
}
