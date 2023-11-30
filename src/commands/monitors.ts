import { Command, Flags } from '@oclif/core';
import * as fs from 'fs';
import * as path from 'path';
import { MonitorService } from '../services/monitor.service';
import { SERVER_CONFIG_BASEPATH } from '../constants/paths';
import { GeneratorService } from '../services/generator.service';
import { ServerConfig } from '../util/types';

export default class Monitors extends Command {
  static description = 'generate monitor configuration';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    filePath: Flags.string({
      char: 'f',
      default: './monitor/fluentbit-agents.csv',
      description: 'path to server configuration',
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Monitors);
    const monitorService = new MonitorService();
    let agentList = '';

    const configDir = fs.readdirSync(path.resolve(SERVER_CONFIG_BASEPATH));
    for (const configFile of configDir) {
      const generatorService = new GeneratorService();
      const serverConfigStr = fs.readFileSync(
        path.resolve(SERVER_CONFIG_BASEPATH, configFile),
        'utf8',
      );
      const serverConfig: ServerConfig = JSON.parse(serverConfigStr);

      if (
        serverConfig.address === '' ||
        serverConfig.address === 'localhost' ||
        serverConfig.os !== 'linux'
      ) {
        continue;
      }

      const agentCount = await generatorService.generate({
        server: path.basename(configFile, '.json'),
        local: false,
        context: [],
        multiple: true,
        skipOutput: true,
      });
      agentList += `${serverConfig.address.split('.')[0]},${agentCount}\n`;
    }
    fs.writeFileSync(flags.filePath, agentList.trimEnd());

    fs.writeFileSync(
      './monitor/monitors.json',
      monitorService.monitorJson(agentList.trimEnd()),
    );
    console.log('monitors.json created in the output folder');
  }
}
