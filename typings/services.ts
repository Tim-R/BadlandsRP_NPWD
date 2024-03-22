export interface ServicePrecheckResp {
  available: boolean;
  message: string;
}

export interface ServicesConfig {
  items: ServiceConfig[],
}

export interface ServiceConfig {
  action: string,
  id: string,
  anonymous?: boolean,

  icon: string,
  name: string,
  subtitle: string,
}
