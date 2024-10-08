import { ResourceConfig } from '@typings/config';
import { getConfig } from '../utils/config';
import {
  Bleet,
  BleeterAccount,
  BleeterAccountLevel,
  BleetsFetchResponse,
  RepliesFetchResponse,
} from '@typings/bleeter';
import { DbInterface } from '@npwd/database';
import { config } from '@npwd/config/server';

const BLEET_SELECT_FIELDS = `
  npwd_bleeter_bleets.id,
  npwd_bleeter_bleets.account_id as accountId,
  npwd_bleeter_bleets.character_id as characterId,
  npwd_bleeter_bleets.replied_id as repliedId,
  npwd_bleeter_bleets.base_account_id as baseAccountId,
  npwd_bleeter_bleets.body,
  npwd_bleeter_bleets.likes,
  npwd_bleeter_bleets.images,
  UNIX_TIMESTAMP(npwd_bleeter_bleets.created_at) as createdAt
`;

export class _BleeterDB {
  private readonly config: ResourceConfig;
  private readonly bleetsPerPage: number;

  constructor() {
    this.config = getConfig();
    this.bleetsPerPage = config?.bleeter?.resultsPerPage || 25;
  }

  async fetchReplies(vrpId: number, repliedId: number): Promise<RepliesFetchResponse> {
    let query = `
      SELECT *
      FROM npwd_bleeter_bleets
      WHERE
        npwd_bleeter_bleets.replied_id = ? AND
      ORDER BY
        npwd_bleeter_bleets.id DESC
    `;
    // maybe add limit to query to prevent too many replies, doubt there will be tons of replies and cba to add pagination atm. Will do if needed.

    const bleets = await DbInterface.fetch<Bleet[]>(query);

    if (bleets.length == 0) {
      return {
        bleets: [],
      };
    }

    return {
      bleets: bleets,
    };
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

  async addBleet(bleet: any) {
    const columns = [];
    const placeholders = [];
    const values = [];

    columns.push('account_id');
    placeholders.push('?');
    values.push(bleet.accountId);

    columns.push('character_id');
    placeholders.push('?');
    values.push(bleet.characterId);

    if (bleet.repliedId !== undefined) {
      columns.push('replied_id');
      placeholders.push('?');
      values.push(bleet.repliedId);
    }

    if (bleet.body !== undefined) {
      columns.push('body');
      placeholders.push('?');
      values.push(bleet.body);
    }

    if (bleet.images !== undefined) {
      columns.push('images');
      placeholders.push('?');
      values.push(bleet.images);
    }

    const query = `
    INSERT INTO npwd_bleeter_bleets
      (${columns.join(', ')}) VALUES
      (${placeholders.join(', ')})
  `;


    const insertId = await DbInterface.insert(query, values);

    if (insertId) {
      const bleetQuery = `
          SELECT ${BLEET_SELECT_FIELDS} FROM npwd_bleeter_bleets WHERE id = ?
        `;
        const bleet = await DbInterface.fetch(bleetQuery, [insertId]);
        return bleet;
    } else {
        return null;
    }
  }

  async fetchBleetsHome(
    vrpId: number,
    excludedAccountIds: number[] = [],
    from?: number,
  ): Promise<BleetsFetchResponse> {
    let query = `
      SELECT ${BLEET_SELECT_FIELDS}
      FROM 
        npwd_bleeter_bleets
      ORDER BY
        npwd_bleeter_bleets.id DESC
      LIMIT ?
    `;

    let bindings = [this.bleetsPerPage];

    if (from) {
      query = `
        SELECT ${BLEET_SELECT_FIELDS}
        FROM npwd_bleeter_bleets
        WHERE
          npwd_bleeter_bleets.id < ?
        ORDER BY
          npwd_bleeter_bleets.id DESC
        LIMIT ?
      `;

      bindings = [from, this.bleetsPerPage];
    }
    

    const bleets = await DbInterface.fetch<Bleet[]>(query, bindings);

    if (bleets.length == 0) {
      return {
        bleets: [],
        accounts: [],
        hasMore: false,
      };
    }

    const accountIds: number[] = [];

    bleets.forEach((bleet) => {
      if (accountIds.indexOf(bleet.accountId) === -1) {
        accountIds.push(bleet.accountId);
      }

      if (bleet.baseAccountId && accountIds.indexOf(bleet.baseAccountId) === -1) {
        accountIds.push(bleet.baseAccountId);
      }
    });

    let queryAccounts = `
      SELECT
        npwd_bleeter_accounts.id,
        npwd_bleeter_accounts.vrp_id as vrpId,
        npwd_bleeter_accounts.character_id as characterId,
        npwd_bleeter_accounts.profile_name as profileName,
        npwd_bleeter_accounts.avatar_url as avatarUrl,
        npwd_bleeter_account_access.active,
        npwd_bleeter_account_access.level
      FROM npwd_bleeter_accounts
        LEFT OUTER JOIN npwd_bleeter_account_access
          ON
            npwd_bleeter_accounts.id = npwd_bleeter_account_access.account_id AND
            npwd_bleeter_account_access.vrp_id = 85898
      WHERE
        npwd_bleeter_accounts.id IN (${accountIds.join(', ')})
    `;

    if (excludedAccountIds.length > 0) {
      queryAccounts += `
        AND npwd_bleeter_accounts.id NOT IN (${excludedAccountIds.join(', ')})
      `;
    }

    

    const accounts = await DbInterface.fetch<BleeterAccount[]>(queryAccounts);

    return {
      bleets: bleets,
      accounts: accounts,
      hasMore: bleets.length == this.bleetsPerPage,
    };
  }

  async fetchBleets(offset: number = 0): Promise<Bleet[]> {
    const query = `
        SELECT ${BLEET_SELECT_FIELDS}
        FROM npwd_bleeter_bleets
        WHERE npwd_bleeter_bleets.deleted_at IS NULL
        ORDER BY npwd_bleeter_bleets.id DESC
        LIMIT ?
        OFFSET ?
    `;

    const result = await DbInterface.fetch<Bleet[]>(query, [this.bleetsPerPage, offset]);

    return result;
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

  async deleteBleet(id: number): Promise<boolean> {
    const query = `
      DELETE FROM npwd_bleeter_bleets
      WHERE
        id = ?`;

    const affectedRows = await DbInterface.exec(query, [id]);

    return affectedRows > 0;
  }

  // editBleet ?

  // TODO: account functions

  async createAccount(
    vrpId: number,
    characterId: number,
    profileName: string,
    avatarUrl?: string,
  ): Promise<BleeterAccount> {
    const query = `
      INSERT INTO npwd_bleeter_accounts
        (vrp_id, character_id, profile_name, avatar_url) VALUES
        (?, ?, ?, ?)
    `;

    const accountId = await DbInterface.insert(query, [vrpId, characterId, profileName, avatarUrl]);

    if (!accountId) {
      return null;
    }

    // Add access pivot
    await DbInterface.insert(
      `
      INSERT INTO npwd_bleeter_account_access
        (vrp_id, character_id, accessor_id, account_id, level) VALUES
        (?, ?, ?, ?, ?)
    `,
      [vrpId, characterId, accountId, accountId, BleeterAccountLevel.LEVEL_ADMIN],
    );

    return await this.fetchAccount('id', accountId);
  }

  async fetchAccounts(column: string, value: any): Promise<BleeterAccount[]> {
    const query = `
      SELECT
        npwd_bleeter_accounts.id,
        npwd_bleeter_accounts.vrp_id as vrpId,
        npwd_bleeter_accounts.character_id as characterId,
        npwd_bleeter_accounts.profile_name as profileName,
        npwd_bleeter_accounts.avatar_url as avatarUrl,
        npwd_bleeter_accounts.created_at as createdAt,
        npwd_bleeter_account_access.level as level,
        npwd_bleeter_account_access.active as active
      FROM npwd_bleeter_accounts
        LEFT OUTER JOIN npwd_bleeter_account_access ON npwd_bleeter_accounts.id = npwd_bleeter_account_access.account_id
      WHERE ${column} = ?
      ORDER BY npwd_bleeter_accounts.profile_name ASC
    `;

    let accounts = await DbInterface.fetch<BleeterAccount[]>(query, [value]);
    if (!accounts) {
      return [];
    }

    return accounts;
  }

  async fetchAccount(column: string, value: any): Promise<BleeterAccount> {
    const accounts = await this.fetchAccounts(column, value);
    if (!accounts || accounts.length == 0) {
      return null;
    }

    return accounts[0];
  }

  async editAccount(
    accountId: number,
    profileName: string,
    avatarUrl: string,
  ): Promise<BleeterAccount> {
    const query = `
      UPDATE npwd_bleeter_accounts
      SET
        profile_name = ?,
        avatar_url = ?
      WHERE
        id = ?
    `;

    const affectedRows = await DbInterface.exec(query, [profileName, avatarUrl, accountId]);

    if (affectedRows == 0) {
      return null;
    }

    return await this.fetchAccount('id', accountId);
  }

  async deleteAccount(accountId: number): Promise<boolean> {
    await DbInterface.exec(
      `
      UPDATE npwd_bleeter_accounts
      SET
        deleted_at = NOW()
      WHERE
        id = ?
      LIMIT
        1
    `,
      [accountId],
    );

    await DbInterface.exec(
      `
      UPDATE npwd_bleeter_bleets
      SET
        deleted_at = NOW()
      WHERE
        account_id = ? OR
        base_account_id = ?
    `,
      [accountId, accountId],
    );

    await DbInterface.exec(
      `
      DELETE FROM npwd_bleeter_account_access
      WHERE
        account_id = ? OR
        accessor_id = ?
    `,
      [accountId, accountId],
    );

    return true;
  }

  async setActiveAccount(vrpId: number, accountId: number): Promise<boolean> {
    const query = `
      UPDATE npwd_bleeter_account_access
      SET active = IF(account_id = ?, 1, 0) WHERE vrp_id = ?
    `;

    const affectedRows = await DbInterface.exec(query, [accountId, vrpId]);

    return affectedRows > 0;
  }

  async getCharacterAccess(accountId: number, characterId: number): Promise<number> {
    const query = `
      SELECT
        level
      FROM npwd_bleeter_account_access
      WHERE
        account_id = ? AND
        character_id = ?
    `;

    const result = await DbInterface.fetch<BleeterAccount[]>(query, [accountId, characterId]);

    if (!result || result.length == 0) {
      return 0;
    }

    return result[0].level;
  }

  async deleteAccountUser(accountId: number, characterId: number): Promise<boolean> {
    const query = `
      DELETE FROM npwd_bleeter_account_access
      WHERE
        account_id = ? AND
        character_id = ?
    `;

    const affectedRows = await DbInterface.exec(query, [accountId, characterId]);

    return affectedRows > 0;
  }

  async addAccountUser(user: BleeterAccount, accountId: number, level: number) {
    const query = `
      INSERT INTO npwd_bleeter_account_access
        (vrp_id, character_id, accessor_id, account_id, level) VALUES
        (?, ?, ?, ?, ?)
    `;

    const affectedRows = await DbInterface.exec(query, [
      user.vrpId,
      user.characterId,
      user.id,
      accountId,
      level,
    ]);

    return affectedRows > 0;
  }

  async editAccountUser(vrpId: number, characterId: number, accountId: number, level: number) {
    console.log(
      `[bleeter.database.ts] editAccountUser ${vrpId} ${characterId} ${accountId} ${level}`,
    );

    const query = `
      UPDATE npwd_bleeter_account_access
      SET
        level = ?
      WHERE
        vrp_id = ? AND
        character_id = ? AND
        account_id = ?
    `;

    const affectedRows = await DbInterface.exec(query, [level, vrpId, characterId, accountId]);

    return affectedRows > 0;
  }

  async fetchAccountUsers(accountId: number): Promise<BleeterAccount[]> {
    const query = `
      SELECT
        npwd_bleeter_accounts.id,
        npwd_bleeter_accounts.vrp_id as vrpId,
        npwd_bleeter_accounts.character_id as characterId,
        npwd_bleeter_accounts.profile_name as profileName,
        npwd_bleeter_accounts.avatar_url as avatarUrl,
        npwd_bleeter_accounts.created_at as createdAt,
        npwd_bleeter_account_access.level as level,
        npwd_bleeter_account_access.active as active
      FROM npwd_bleeter_account_access
        LEFT OUTER JOIN npwd_bleeter_accounts ON npwd_bleeter_accounts.id = npwd_bleeter_account_access.accessor_id
      WHERE
        npwd_bleeter_account_access.account_id = ? AND
        npwd_bleeter_account_access.accessor_id != npwd_bleeter_account_access.account_id
      ORDER BY npwd_bleeter_accounts.profile_name ASC
    `;

    let accounts = await DbInterface.fetch<BleeterAccount[]>(query, [accountId]);

    if (!accounts) {
      return [];
    }

    return accounts;
  }
}

export const BleeterDB = new _BleeterDB();
