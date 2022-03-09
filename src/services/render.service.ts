import * as fs from 'fs';
import * as path from 'path';
import * as nunjucks from 'nunjucks';

import {CONFIG_BASEPATH, OUTPUT_BASEPATH, TEMPLATE_CONFIG_BASEPATH} from '../constants/paths';
import {BaseConfig, FbFile, ServerAppConfig, TypeConfig} from '../util/types';


const baseConfigStr = fs.readFileSync(path.resolve(CONFIG_BASEPATH, `base.json`), 'utf8');
const baseConfig: BaseConfig = JSON.parse(baseConfigStr);

export class RenderService {
  static typeCnt: {
    [type: string]: number
  } = {};
  public static init() {
    nunjucks.configure(TEMPLATE_CONFIG_BASEPATH, {
      autoescape: true,
    });
    this.clean();
  }

  public static fileToOutputPath(file: FbFile): string {
    return file.name !== undefined ? file.name : file.tmpl.substring(0, file.tmpl.length - 4);
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
    for (const file of baseConfig.files) {
      this.writeRenderedTemplate(file.tmpl, this.fileToOutputPath(file), context);
    }
  }

  public static writeApp(app: ServerAppConfig) {
    const typeConfigPath = path.resolve(TEMPLATE_CONFIG_BASEPATH, app.type, `${app.type}.json`);
    const typeConfigStr = fs.readFileSync(typeConfigPath, 'utf8');
    const type: TypeConfig = JSON.parse(typeConfigStr);

    RenderService.writeType(app, type);
  }

  public static writeType(
    app: ServerAppConfig,
    type: TypeConfig) {
    const context = {...type.context, ...app.context};
    this.typeCnt[app.type] = this.typeCnt[app.type] ? this.typeCnt[app.type] + 1 : 1;
    const typeTag = app.id ? app.id : `${app.type}_${this.typeCnt[app.type]}`;

    for (const file of type.files) {
      this.writeRenderedTemplate(
        `${app.type}/${file.tmpl}`,
        `${typeTag}/${this.fileToOutputPath(file)}`,
        {
          typeTag,
          ...baseConfig.context,
          ...context,
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
