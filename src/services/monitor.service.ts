import * as crypto from 'crypto';

const QUERY_LEVEL_TRIGGER_ID_1 = '1';
const TEAMS_CHANNEL_ACTION_ID_2 = '2';
const AUTOMATION_QUEUE_ACTION_ID_3 = '3';
const JSON_FORMAT_SPACE_COUNT = 2;
const ID_MAX_LENGTH = 20;
const NEW_LINE_DELIMITER = '\n';
const DELIMITER = ',';

type Monitor = {
  name: string;
  server: string;
  agent: string;
  // eslint-disable-next-line camelcase
  query_level_trigger_id: string;
  // eslint-disable-next-line camelcase
  teams_channel_action_id: string;
  // eslint-disable-next-line camelcase
  automation_queue_action_id: string;
};

/**
 * The monitor service generates files for generating monitors in OpenSearch
 */
export class MonitorService {
  public monitorJson(ipFile: string): string {
    const monitorsList: Monitor[] = [];
    const serverList = ipFile.split(NEW_LINE_DELIMITER);
    for (const i of serverList) {
      const serverName = i.split(DELIMITER)[0];
      const agentCount = Number(i.split(DELIMITER)[1]);
      for (let j = 0; j < agentCount; j++) {
        const monitor: Monitor = {
          name: `nrm_${serverName}_fluentbit_${j}`,
          server: serverName,
          agent: `fluent-bit.${j}`,
          query_level_trigger_id: crypto
            .createHash('sha256')
            .update(serverName + j.toString() + QUERY_LEVEL_TRIGGER_ID_1)
            .digest('hex')
            .substring(0, ID_MAX_LENGTH),
          teams_channel_action_id: crypto
            .createHash('sha256')
            .update(serverName + j.toString() + TEAMS_CHANNEL_ACTION_ID_2)
            .digest('hex')
            .substring(0, ID_MAX_LENGTH),
          automation_queue_action_id: crypto
            .createHash('sha256')
            .update(serverName + j.toString() + AUTOMATION_QUEUE_ACTION_ID_3)
            .digest('hex')
            .substring(0, ID_MAX_LENGTH),
        };
        monitorsList.push(monitor);
      }
    }
    return JSON.stringify(monitorsList, null, JSON_FORMAT_SPACE_COUNT);
  }
}
