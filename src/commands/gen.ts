import { Command, Flags } from '@oclif/core';
import { GeneratorService } from '../services/generator.service';

/**
 * Generate command for funbucks
 */
export default class Gen extends Command {
  static description = 'generate fluentbit configuration';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    server: Flags.string({
      char: 's',
      required: true,
      description: 'server configuration to render',
    }),
    local: Flags.boolean({
      char: 'l',
      description: 'render for sending logs to local lambda',
    }),
    app: Flags.string({
      char: 'a',
      description: 'limits output to only this application id',
    }),
    context: Flags.string({
      char: 'c',
      multiple: true,
      default: [],
      description:
        'context override. Examples: appPathJq//tmp/jq, deploy_1:inputPath//tmp/file',
    }),
    multiple: Flags.boolean({
      char: 'm',
      description:
        'multiple configuration output mode. A single Fluent Bit has an upper bound to the number of filters it can handle. Do not combine with oc command.',
    }),
  };

  /**
   * Generate command
   */
  public async run(): Promise<void> {
    const { flags } = await this.parse(Gen);
    const service = new GeneratorService();
    await service.generate(flags);
  }
}
