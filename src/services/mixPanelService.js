import * as ClientService from './clientServices';
import { fetchUser } from './userService';
import * as MetaDataService from './metaDataService';
import * as TrackService from './trackService';
import * as PageService from './pageService';

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