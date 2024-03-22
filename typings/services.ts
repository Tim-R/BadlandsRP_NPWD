export interface ServicePrecheckResp {
  available: boolean;
  message: string;
}

export interface ServicesConfig {
  items: ServiceConfig[],
  factionActions: ServiceAction[]
}

export interface ServiceConfig {
  action: string,
  id: string,
  anonymous?: boolean,

  icon: string,
  name: string,
  subtitle: string,
}

export interface ServiceAction {
  id: string,
  groups: string[],
  icon: string,
  name: string,
  subtitle: string,
  range?: string,
  message?: string,
  urgency?: string,
}
