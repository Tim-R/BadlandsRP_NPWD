import { Advertisement } from "@typings/advertisements";
import { DbInterface } from "@npwd/database";
import { getConfig } from "../utils/config";
import { ResourceConfig } from "@typings/config";

export class _AdvertisementsDB {
  private readonly config: ResourceConfig;

  constructor() {
    this.config = getConfig();
  }

  async getAdvertisements(): Promise<Advertisement[]> {
    const minutes = this.config.advertisements.hideAfter;
    const query = `SELECT npwd_advertisements.id,
                          npwd_advertisements.character_id               as characterId,
                          npwd_advertisements.business,
                          npwd_advertisements.body,
                          UNIX_TIMESTAMP(npwd_advertisements.updated_at) as updatedAt
                   FROM npwd_advertisements
                   WHERE
                        npwd_advertisements.deleted_at IS NULL AND
                        npwd_advertisements.updated_at >= DATE_SUB(NOW(), INTERVAL ${minutes} MINUTE)`;

    const results = await DbInterface.fetch<Advertisement[]>(query);

    return results;
  }
}

export const AdvertisementsDB = new _AdvertisementsDB();
