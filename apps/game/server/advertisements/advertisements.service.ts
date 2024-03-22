import { AdvertisementsDB, _AdvertisementsDB } from "./advertisements.database";
import { mainLogger } from '../sv_logger';
import { PromiseEventResp, PromiseRequest } from "../lib/PromiseNetEvents/promise.types";
import { Advertisement } from "@typings/advertisements";

class _AdvertisementsService {
  private readonly advertisementsDB: _AdvertisementsDB;

  constructor() {
    this.advertisementsDB = AdvertisementsDB;
    mainLogger.debug('Messages service started');
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

  /*
  async handleFetchMessageConversations(
    reqObj: PromiseRequest<void>,
    resp: PromiseEventResp<MessageConversation[]>,
  ) {
    const phoneNumber = PlayerService.getPlayer(reqObj.source).getPhoneNumber();

    try {
      const conversations = await MessagesDB.getConversations(phoneNumber);

      resp({ status: 'ok', data: conversations });
    } catch (err) {
      resp({ status: 'error', errorMsg: err.message });
    }
  }
  */
}

const AdvertisementsService = new _AdvertisementsService();

export default AdvertisementsService;
