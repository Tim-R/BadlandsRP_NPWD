import { onNetPromise } from "../lib/PromiseNetEvents/onNetPromise";
import { Advertisement, AdvertisementsEvents } from "@typings/advertisements";
import { mainLogger } from '../sv_logger';
import AdvertisementsService from "./advertisements.service";
import { Location } from "@typings/common";

onNetPromise<void, Advertisement[]>(
  AdvertisementsEvents.FETCH_ADVERTISEMENTS,
  async (reqObj, resp) => {
    AdvertisementsService.handleFetchAdvertisements(reqObj, resp).catch((e) => {
      mainLogger.error(`Error occurred in fetch advertisements (${reqObj.source}), Error: ${e.message}`);
      resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
  },
);

onNetPromise<void, Advertisement[]>(
  AdvertisementsEvents.FETCH_MY_ADVERTISEMENTS,
  async (reqObj, resp) => {
    AdvertisementsService.handleFetchMyAdvertisements(reqObj, resp).catch((e) => {
      mainLogger.error(`Error occurred in fetch my advertisements (${reqObj.source}), Error: ${e.message}`);
      resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
  },
);

onNetPromise<{ adId: number }, Advertisement[]>(
  AdvertisementsEvents.BUMP_AD,
  async (reqObj, resp) => {
    AdvertisementsService.handleBumpAd(reqObj, resp).catch((e) => {
      mainLogger.error(`Error occurred in bump advertisement (${reqObj.source}), Error: ${e.message}`);
    })
  },
);

onNetPromise<{ adId: number }, Advertisement[]>(
  AdvertisementsEvents.DELETE_AD,
  async (reqObj, resp) => {
    AdvertisementsService.handleDeleteAd(reqObj, resp).catch((e) => {
      mainLogger.error(`Error occurred in delete advertisement (${reqObj.source}), Error: ${e.message}`);
    })
  },
);

onNetPromise<{
  adId: number,
  business?: string,
  body: string,
  phone?: string,
  location?: Location
}, Advertisement[]>(
  AdvertisementsEvents.EDIT_AD,
  async (reqObj, resp) => {
    AdvertisementsService.handleEditAd(reqObj, resp).catch((e) => {
      mainLogger.error(`Error occurred in edit advertisement (${reqObj.source}), Error: ${e.message}`);
    })
  },
);

onNetPromise<{
  business?: string,
  body: string,
  phone?: string,
  location?: Location
}, Advertisement[]>(
  AdvertisementsEvents.CREATE_AD,
  async (reqObj, resp) => {
    AdvertisementsService.handleCreateAd(reqObj, resp).catch((e) => {
      mainLogger.error(`Error occurred in create advertisement (${reqObj.source}), Error: ${e.message}`);
    })
  },
);

