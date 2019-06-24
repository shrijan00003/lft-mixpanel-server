import * as ClientService from './clientServices';
import { fetchUser } from './userService';
import * as MetaDataService from './metaDataService';
import * as TrackService from './trackService';
import * as PageService from './pageService';
import * as UserService from './userService';

export async function indentifyClient(clientId, email) {
  try {
    const clientByClientId = await ClientService.fetchClient(clientId);
    const clientByUserEmail = await fetchUser(email);
    if (clientByClientId.attributes.userId === clientByUserEmail.attributes.id) {
      return {
        status: 200,
        statusMessage: 'Client is Identified with Client Id and Email',
      };
    } else {
      throw {
        status: 403,
        statusMessage: 'Client Not Found',
      };
    }
  } catch (err) {
    throw err;
  }
}

export async function saveMetaData(clientId, clientIp, metaDataObj) {
  try {
    const res = await MetaDataService.createMetaData(clientId, clientIp, metaDataObj);
    // console.log(res);

    return res;
  } catch (err) {
    throw err;
  }
}

export async function saveTrackData(metadataId, rest) {
  try {
    const { eventName, payload } = rest;
    const res = await TrackService.createNewTrack(metadataId, eventName, payload);

    return res;
  } catch (err) {
    throw err;
  }
}

export async function savePageData(metadataId, rest) {
  try {
    const res = await PageService.createNewPage(metadataId, rest);

    return res;
  } catch (err) {
    throw err;
  }
}

export async function getAllTracks(clientId, query) {
  try {
    const res = await TrackService.getTracksWithMetaData(clientId, query);

    return res;
  } catch (err) {
    throw err;
  }
}

export function getAllPages(clientId, query) {
  try {
    const res = PageService.getPagesWithMetaData(clientId, query);
    // console.log('response', res);
    if (res) {
      return res;
    }
  } catch (err) {
    console.log(err);
    throw {
      status: 400,
      statusMessage: 'NOT FOUND FROM MIXPANEL SERVICES',
    };
  }
}

export function getMaxDevices(clientId, col, table) {
  try {
    const res = TrackService.getMaxUsedDevices(clientId, col, table);
    if (res) {
      return res;
    }
  } catch (err) {
    console.log(err);
    throw {
      status: 400,
      statusMessage: 'NOT FOUND FROM MIXPANEL SERVICES',
    };
  }
}
export function getMaxPaths(col, table) {
  try {
    const res = PageService.getMaxUsedPaths(col, table);
    if (res) {
      return res;
    }
  } catch (err) {
    console.log(err);
    throw {
      status: 400,
      statusMessage: 'NOT FOUND FROM MIXPANEL SERVICES',
    };
  }
}

export async function getClientIdByUserId(userId) {
  const clientId = await UserService.getClientId(userId);

  return clientId;
}

export async function getTotalUserData(clientId = '') {
  const data = await MetaDataService.getTotalUserData(clientId);

  return data;
}
export async function getTotalCountriesData(clientId = '') {
  const data = await MetaDataService.getTotalCountriesData(clientId);

  return data;
}

export async function getMonthlyUserData(clientId = '') {
  const data = await MetaDataService.getMonthlyUserData(clientId);

  return data;
}

export async function getAverageUser(clientId = '') {
  const data = await MetaDataService.averageUser(clientId);

  return data;
}

export async function getAllMetaData(clientId = '') {
  const data = await MetaDataService.allMetaData(clientId);

  return data;
}

export async function getTrackAnalytics(clientId = '', query = {}) {
  const data = await TrackService.getTrackAnalytics(clientId, query);

  return data;
}

export async function getPageAnalytics(clientId = '', query = {}) {
  const data = await PageService.getPageAnalytics(clientId, query);

  return data;
}
