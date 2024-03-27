import { ResourceConfig } from "@typings/config";
import { getConfig } from "../utils/config";
import { Bleet, BleeterAccount } from "@typings/bleeter";
import { DbInterface } from "@npwd/database";

export class _BleeterDB {
  private readonly config: ResourceConfig;

  constructor() {
    this.config = getConfig();
  }

  async fetchBleet(bleetId: number): Promise<Bleet> {
    return null; // TODO: function stub
  }

  /*
    export interface Bleet {
      id: number,
      accountId: number,
      characterId: number,
      repliedId: number,
      body: string,
      likes: number,
      images?: string,
      rebleets: number,
      createdAt: number,

      // From account relation
      profileName: string,
      avatarUrl: string,
    }
  */

  async fetchBleets(offset: number = 0): Promise<Bleet[]> {
    const limit = 25; // TODO: to config

    const query = `
        SELECT  npwd_bleeter_bleets.id,
                npwd_bleeter_bleets.account_id as accountId,
                npwd_bleeter_bleets.character_id as characterId,
                npwd_bleeter_bleets.replied_id as repliedId,
                npwd_bleeter_bleets.body,
                npwd_bleeter_bleets.likes,
                npwd_bleeter_bleets.images,
                npwd_bleeter_bleets.rebleets,
                npwd_bleeter_bleets.created_at as createdAt,
                npwd_bleeter_accounts.profile_name as profileName,
                npwd_bleeter_accounts.avatar_url as avatarUrl
        FROM npwd_bleeter_bleets
          LEFT OUTER JOIN npwd_bleeter_accounts ON npwd_bleeter_bleets.account_id = npwd_bleeter_accounts.id
        WHERE   npwd_bleeter_bleets.deleted_at IS NULL
        ORDER BY npwd_bleeter_bleets.id DESC
        LIMIT ?
        OFFSET ?
    `;

    const result = await DbInterface.fetch<Bleet[]>(query, [limit, offset]);

    return result
  }

  async getAccountBleets(accountId: number): Promise<Bleet[]> {
    return null; // TODO: function stub
  }

  async likeBleet(bleetId: number): Promise<number> {
    return null; // TODO: function stub
  }

  async unLikeBleet(bleetId: number): Promise<number> {
    return null; // TODO: function stub
  }

  async deleteBleet(bleetId: number): Promise<number> {
    return null; // TODO: function stub
  }

  // editBleet ?

  async addBleet(bleet: Bleet): Promise<number> {
    return null; // TODO: function stub
  }

  // TODO: account functions
}

export const BleeterDB = new _BleeterDB();
