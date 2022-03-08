import {Command, Flags} from '@oclif/core';

import * as fs from 'fs';
import * as path from 'path';
import {RenderService} from '../services/render.service';
import {ServerConfig, TypeConfig} from '../util/types';
import {TYPE_CONFIG_BASEPATH, SERVER_CONFIG_BASEPATH} from '../constants/paths';

export default class Gen extends Command {
  static description = 'generate fluentbit configuration'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    server: Flags.string({char: 's', required: true, description: 'server to render the config for'}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Gen);

    RenderService.init();
    RenderService.writeBase({});

    const serverConfigStr = fs.readFileSync(path.resolve(SERVER_CONFIG_BASEPATH, `${flags.server}.json`), 'utf8');
    const serverConfig: ServerConfig = JSON.parse(serverConfigStr);
    console.log(serverConfig.context);

    for (const app of serverConfig.apps) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const typeConfigStr = fs.readFileSync(path.resolve(TYPE_CONFIG_BASEPATH, `${app.type}.json`), 'utf8');
      const typeConfig: TypeConfig = JSON.parse(typeConfigStr);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      RenderService.writeType({...typeConfig.context, ...app.context}, app.type, app.id);
    }
  }
}
