export interface Advertisement {
  id: number,
  characterId: number,
  business?: string,
  body: string,
  updatedAt?: number;
}

export interface AdvertisementsConfig {
  priceInitial: number,
  priceBump: number,
  hideAfter: number,
  bumpFor: number,
}

export enum AdvertisementsEvents {
  FETCH_ADVERTISEMENTS = 'npwd:fetchAdvertisements',

  /*
  FETCH_MESSAGE_CONVERSATIONS = 'npwd:fetchMessageGroups',
  FETCH_MESSAGE_GROUPS_SUCCESS = 'npwd:fetchMessageGroupsSuccess',
  FETCH_MESSAGE_GROUPS_FAILED = 'npwd:fetchMessageGroupsFailed',
  CREATE_MESSAGE_CONVERSATION = 'npwd:createMessageGroup',
  CREATE_MESSAGE_CONVERSATION_SUCCESS = 'npwd:createMessageConversationSuccess',
  CREATE_MESSAGE_GROUP_SUCCESS = 'npwd:createMessageGroupSuccess',
  CREATE_MESSAGE_GROUP_FAILED = 'npwd:createMessageGroupFailed',
  SEND_MESSAGE = 'npwd:sendMessage',
  SEND_EMBED_MESSAGE = 'npwd:sendEmbedMessage',
  SEND_MESSAGE_SUCCESS = 'npwd:sendMessageSuccess',
  SEND_MESSAGE_FAILED = 'npwd:sendMessageFailed',
  DELETE_MESSAGE = 'npwd:deleteMessage',
  FETCH_MESSAGES = 'npwd:fetchMessages',
  FETCH_MESSAGES_SUCCESS = 'npwd:fetchMessagesSuccess',
  FETCH_MESSAGES_FAILED = 'npwd:fetchMessagesFailed',
  FETCH_INITIAL_MESSAGES = 'npwd:fetchInitialMessages',
  ACTION_RESULT = 'npwd:setMessagesAlert',
  CREATE_MESSAGE_BROADCAST = 'npwd:createMessagesBroadcast',
  SET_MESSAGE_READ = 'npwd:setReadMessages',
  DELETE_CONVERSATION = 'nwpd:deleteConversation',
  GET_MESSAGE_LOCATION = 'npwd:getMessageLocation',
  MESSAGES_SET_WAYPOINT = 'npwd:setWaypoint',
  */
}
