import { AdvertisementsDB, _AdvertisementsDB } from "./advertisements.database";
import { mainLogger } from '../sv_logger';
import { PromiseEventResp, PromiseRequest } from "../lib/PromiseNetEvents/promise.types";
import { Advertisement, AdvertisementsEvents } from "@typings/advertisements";
import PlayerService from "../players/player.service";
import { getConfig } from "../utils/config";
import { ResourceConfig } from "@typings/config";
import { Location } from "@typings/common";
import { scanInputForBadWords } from "../utils/badWords";


class _AdvertisementsService {
  private readonly advertisementsDB: _AdvertisementsDB;
  private readonly config: ResourceConfig;

  constructor() {
    this.advertisementsDB = AdvertisementsDB;
    this.config = getConfig();
  }

  async handleFetchAdvertisements(
    reqObj: PromiseRequest<void>,
    resp: PromiseEventResp<Advertisement[]>,
  ) {
    try {
      const advertisements = await this.advertisementsDB.getAdvertisements();

      resp({ status: 'ok', data: advertisements });
    } catch(err) {
      resp({ status: 'error', errorMsg: err.message });
    }
  }

  async handleBumpAd(
    reqObj: PromiseRequest<{ adId: number }>,
    resp: PromiseEventResp<void>,
  ) {
    try {
      const identifier = PlayerService.getIdentifier(reqObj.source);
      const groups = PlayerService.getGroups(reqObj.source);

      let paid = await PlayerService.tryTakeBankMoney(reqObj.source, this.config.advertisements.priceBump);

      if(!paid) {
        resp({ status: 'error', errorMsg: 'Insufficient funds' });
        return;
      }

      let rowsAffected = await this.advertisementsDB.bumpAd(identifier, groups, reqObj.data.adId);

      if(rowsAffected == 0) {
        resp({ status: 'error', errorMsg: 'Unable to bump advertisement' });
        return;
      }

      PlayerService.log(reqObj.source, 'ACTION', `Paid $${this.config.advertisements.priceBump} to bump advertisement`, {
        id: reqObj.data.adId
      });

      resp({ status: 'ok' });
      emitNet(AdvertisementsEvents.BUMP_AD_BROADCAST, -1, reqObj.data.adId);
    } catch(e) {
      resp({ status: 'error', errorMsg: e.message });
    }
  }

  async handleDeleteAd(
    reqObj: PromiseRequest<{ adId: number }>,
    resp: PromiseEventResp<void>,
  ) {
    try {
      const identifier = PlayerService.getIdentifier(reqObj.source);
      const groups = PlayerService.getGroups(reqObj.source);

      let rowsAffected = await this.advertisementsDB.deleteAd(identifier, groups, reqObj.data.adId);

      if(rowsAffected == 0) {
        resp({ status: 'error', errorMsg: 'Unable to delete advertisement' });
        return;
      }

      PlayerService.log(reqObj.source, 'ACTION', `Deleted advertisement`, {
        id: reqObj.data.adId
      });

      resp({ status: 'ok' });
      emitNet(AdvertisementsEvents.DELETE_AD_BROADCAST, -1, reqObj.data.adId);
    } catch(e) {
      resp({ status: 'error', errorMsg: e.message });
    }
  }

  async handleEditAd(
    reqObj: PromiseRequest<{
      adId: number,
      business?: string,
      body: string,
      phone?: string,
      location?: Location
     }>,
    resp: PromiseEventResp<void>,
  ) {
    try {
      const identifier = PlayerService.getIdentifier(reqObj.source);
      const groups = PlayerService.getGroups(reqObj.source);

      if(scanInputForBadWords(reqObj.source, 'PHONE-ADVERTISEMENTS', reqObj.data.body)) {
        return;
      }

      let rowsAffected = await this.advertisementsDB.editAd(identifier, groups, reqObj.data);

      if(rowsAffected == 0) {
        resp({ status: 'error', errorMsg: 'Unable to edit advertisement' });
        return;
      }

      PlayerService.log(reqObj.source, 'ACTION', `Edited advertisement`, {
        id: reqObj.data.adId,
        body: reqObj.data.body,
        business: reqObj.data.business,
        phone: reqObj.data.phone,
        location: reqObj.data.location
      });

      resp({ status: 'ok' });
      emitNet(AdvertisementsEvents.EDIT_AD_BROADCAST, -1, reqObj.data);
    } catch(e) {
      resp({ status: 'error', errorMsg: e.message });
    }
  }

  async handleCreateAd(
    reqObj: PromiseRequest<{
      business?: string,
      body: string,
      phone?: string,
      location?: Location
     }>,
    resp: PromiseEventResp<void>,
  ) {
    try {
      const characterId = PlayerService.getCharacterId(reqObj.source);
      const characterName = PlayerService.getCharacterName(reqObj.source);

      let badWords = await scanInputForBadWords(reqObj.source, 'PHONE-ADVERTISEMENTS', reqObj.data.body);

      if(badWords) {
        resp({ status: 'error', errorMsg: 'Bad word filter failed' });
        return;
      }

      let paid = await PlayerService.tryTakeBankMoney(reqObj.source, this.config.advertisements.priceInitial);

      if(!paid) {
        resp({ status: 'error', errorMsg: 'Insufficient funds' });
        return;
      }

      let advertisement = await this.advertisementsDB.createAd(characterId, characterName, reqObj.data);

      if(!advertisement) {
        resp({ status: 'error', errorMsg: 'Unable to create advertisement' });
        return;
      }

      PlayerService.log(reqObj.source, 'ACTION', `Created advertisement`, {
        body: reqObj.data.body,
        business: reqObj.data.business,
        phone: reqObj.data.phone,
        location: reqObj.data.location,
        price: this.config.advertisements.priceInitial,
      });

      resp({ status: 'ok' });
      emitNet(AdvertisementsEvents.CREATE_AD_BROADCAST, -1, advertisement);
    } catch(e) {
      resp({ status: 'error', errorMsg: e.message });
    }
  }
}

const AdvertisementsService = new _AdvertisementsService();

export default AdvertisementsService;
