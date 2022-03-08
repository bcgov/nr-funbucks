export interface TypeConfig {
  context: object;
}

export interface ServerAppConfig {
  id: string;
  type: string;
  context: object;
}

export interface ServerConfig {
  address: string;
  apps: ServerAppConfig[];
  context: object;
}

export interface BaseConfig {
  context: object;
}
