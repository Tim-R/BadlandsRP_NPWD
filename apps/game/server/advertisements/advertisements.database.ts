import { Advertisement, deserializeAdvertisement } from "@typings/advertisements";
import { DbInterface } from "@npwd/database";
import { getConfig } from "../utils/config";
import { ResourceConfig } from "@typings/config";
import { Location } from "@typings/common";

export class _AdvertisementsDB {
  private readonly config: ResourceConfig;

  constructor() {
    this.config = getConfig();
  }

  async getAdvertisements(): Promise<Advertisement[]> {
    const hideAfter = this.config.advertisements.hideAfter;

    const query = `
        SELECT npwd_advertisements.id,
               npwd_advertisements.character_id               as characterId,
               npwd_advertisements.character_name             as characterName,
               npwd_advertisements.business,
               npwd_advertisements.body,
               npwd_advertisements.phone,
               npwd_advertisements.location,
               UNIX_TIMESTAMP(npwd_advertisements.bumped_at)  as bumpedAt
        FROM npwd_advertisements
        WHERE
          npwd_advertisements.deleted_at IS NULL AND
          npwd_advertisements.updated_at >= DATE_SUB(NOW(), INTERVAL ${hideAfter} MINUTE)
    `;

    const results = (await DbInterface.fetch<Advertisement[]>(query)).map(a => deserializeAdvertisement(a));

    return results;
  }

  async bumpAd(identifier: string, groups: string[], adId: number): Promise<number> {
    const groupsDb = groups.map(group => {
      return `"${group}"`;
    }).join(',');

    const query = `
        UPDATE npwd_advertisements
        SET bumped_at = NOW(),
            times_bumped = times_bumped + 1
        WHERE (
          character_id = ? OR
          (
            business IS NOT NULL AND
            business IN (${groupsDb})
          )
        ) AND id = ?
    `;

    return await DbInterface.exec(query, [identifier, adId]);
  }

  async deleteAd(identifier: string, groups: string[], adId: number): Promise<number> {
    const groupsDb = groups.map(group => {
      return `"${group}"`;
    }).join(',');

    const query = `
        UPDATE npwd_advertisements SET deleted_at = NOW()
        WHERE (
          character_id = ? OR
          (
            business IS NOT NULL AND
            business IN (${groupsDb})
          )
        ) AND id = ?
    `;

    return await DbInterface.exec(query, [identifier, adId]);
  }

  async editAd(
    identifier: string,
    groups: string[],
    data: { adId: number, business?: string, body: string, phone?: string, location?: Location }
  ): Promise<number> {
    const groupsDb = groups.map(group => {
      return `"${group}"`;
    }).join(',');

    const query = `
        UPDATE npwd_advertisements
        SET business = ?,
            body     = ?,
            phone    = ?,
            location = ?
        WHERE (
          character_id = ? OR
          (
            business IS NOT NULL AND
            business IN (${groupsDb})
          )
        ) AND id = ?
    `;

    const locationBinding = data.location !== null ? JSON.stringify(data.location) : null;

    return await DbInterface.exec(query, [data.business, data.body, data.phone, locationBinding, identifier, data.adId])
  }

  async createAd(
    characterId: number,
    characterName: string,
    data: { business?: string, body: string, phone?: string, location?: Location }
  ): Promise<Advertisement> {
    const query = `
        INSERT INTO npwd_advertisements (character_id, character_name, business, body, phone, location)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const locationBinding = data.location !== null ? JSON.stringify(data.location) : null;

    let insertId = await DbInterface.insert(query, [characterId, characterName, data.business, data.body, data.phone, locationBinding])

    return {
      id: insertId,
      characterId: characterId,
      characterName: characterName,
      business: data.business,
      body: data.body,
      phone: data.phone,
      location: data.location,
      bumpedAt: Math.floor(Date.now() / 1000),
    }
  }
}

export const AdvertisementsDB = new _AdvertisementsDB();
