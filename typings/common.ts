export interface ServerPromiseResp<T = undefined> {
  errorMsg?: string;
  status: 'ok' | 'error';
  data?: T;
}

export type Spread<T1, T2> = { [K in Exclude<keyof T1, keyof T2>]: T1[K] } & T2;

export interface Vector {
  x: number,
  y: number,
  z: number,
  w?: number
}

export interface Location {
  zone: string,
  coords: Vector
}

export class NamedLocation implements Location {
  zone: string;
  coords: Vector;

  get zoneName(): string {
    return "ZONE_NAME_HERE"; // TODO
  }

  static fromJson(json: any): NamedLocation {
    return JSON.parse(json) as NamedLocation;
  }
}

export enum CommonEvents {
  SET_GPS = 'npwd:setGps',
  GET_COORDS = 'npwd:getCoords',
  GET_LOCATION = 'npwd:getLocation',
}
