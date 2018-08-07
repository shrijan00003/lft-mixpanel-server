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

export async function saveMetaData(metaDataObj) {
  try {
    const res = await MetaDataService.createMetaData(metaDataObj);
    // console.log(res);

    return res;
  } catch (err) {
    throw err;
  }
}

export async function saveTrackData(eventName, metadataId, payload) {
  try {
    const res = await TrackService.createNewTrack(eventName, metadataId, payload);

    return res;
  } catch (err) {
    throw err;
  }
}

export async function savePageData(metadataId, dataObj) {
  try {
    console.log('------------req----------', metadataId, dataObj);
    const res = await PageService.createNewPage(metadataId, dataObj);
    // console.log('------------res----------', res);

    return res;
  } catch (err) {
    throw err;
  }
}
