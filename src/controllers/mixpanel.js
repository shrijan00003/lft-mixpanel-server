import client from '../redis';
import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { identyfyClient } from '../middlewares/identifyClient';
import * as MixPanelService from '../services/mixPanelService';
// import { CLIENT_INFORMATION } from '../constants/redisConstants';
import { isEmpty } from '../utils/getObject';
let crg = require('country-reverse-geocoding').country_reverse_geocoding();

const router = Router();
/**
 * @argument req
 * @response status
 */
router.post('/configure', async (req, res, next) => {
  try {
    if (!isEmpty(req.body)) {
      const { clientId, email } = req.body;
      // await client.set(CLIENT_INFORMATION, JSON.stringify({ clientId, email }));
      await client.set(email, clientId);
      res.status(200).json({ message: 'session is configured' });
    } else {
      throw {
        status: 403,
        statusMessage: 'Request Body is empty Please provide essential like clientId and Email',
      };
    }
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ message: err.statusMessage });
  }
});

/**
 *
 */
router.post('/disconfigure', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (client.exists(email)) {
      await client.del(email, (err, result) => {
        if (result === 1) {
          res.status(200).json({ message: 'Client Information Disconfigured' });
        } else {
          res.status(403).json({ message: 'Error Occured' + err });
        }
      });
    } else {
      throw {
        status: 403,
        statusMessage: 'Not configured yet first configure',
      };
    }
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ message: err.statusMessage });
  }
});

/**
 * @argument req
 * @response status and jsonindentifyClient
 */
router.post('/identify', identyfyClient, async (req, res, next) => {
  try {
    let metadata = req.body.metaData;

    const { location } = metadata;

    const country = crg.get_country(location.latitude, location.longitude);

    location.countryCode = country.code;
    location.countryName = country.name;

    metadata = {
      ...metadata,
      location,
    };

    const savedMetaData = await MixPanelService.saveMetaData(req.clientId, req.clientIp, metadata);
    res.status(200).json(savedMetaData);
  } catch (err) {
    res.status(err.status).json({ message: err.statusMessage });
  }
});

/**
 * @argument req
 * @response status and json
 */
router.post('/track', identyfyClient, async (req, res, next) => {
  console.log('track called');
  try {
    let id = undefined;
    let savedMetaData = undefined;

    const { email, ...rest } = req.body.trackData;
    console.log(email);

    const { metadataId } = req.body.metaData;

    if (!metadataId) {
      savedMetaData = await MixPanelService.saveMetaData(req.clientId, req.clientIp, req.body.metaData);
      id = savedMetaData.id;
    } else {
      id = metadataId;
    }
    const savedTrackData = await MixPanelService.saveTrackData(id, rest);
    if (savedTrackData) {
      res.status(200).json({
        savedMetaData,
        savedTrackData,
      });
    }
  } catch (err) {
    next(err);
    res.status(err.status).json({ message: err.statusMessage });
  }
});

/**
 * @argument req
 * @response status and json
 */
router.post('/page', identyfyClient, async (req, res, next) => {
  try {
    let id = undefined;
    let savedMetaData = undefined;
    const { email, ...rest } = req.body.pageData;
    console.log(email);

    const { metadataId } = req.body.metaData;

    if (!metadataId) {
      savedMetaData = await MixPanelService.saveMetaData(req.clientId, req.clientIp, req.body.metaData);
      id = savedMetaData.id;
    } else {
      id = metadataId;
    }
    const savedPagesData = await MixPanelService.savePageData(id, rest);
    if (savedPagesData) {
      res.status(200).json({
        savedMetaData,
        savedPagesData,
      });
    }
  } catch (err) {
    res.status(err.status).json({ message: err.statusMessage });
  }
});

/**
 * GET /api/mixpanel/traks
 */
router.get('/tracks', authenticate, async (req, res, next) => {
  try {
    const clientId = await MixPanelService.getClientIdByUserId(req.userId);
    if (clientId) {
      const data = await MixPanelService.getAllTracks(clientId, req.query);
      if (data) {
        res.status(200).json({
          data,
          metadata: data.pagination,
        });
      }
    }
  } catch (err) {
    res.status(err.status).json({ message: err.statusMessage });
  }
});

router.get('/pages', authenticate, async (req, res, next) => {
  try {
    const clientId = await MixPanelService.getClientIdByUserId(req.userId);
    if (clientId) {
      const data = await MixPanelService.getAllPages(clientId, req.query);
      if (data) {
        res.status(200).json({
          data,
          meta: data.pagination,
        });
      }
    }
  } catch (err) {
    res.status(err.status).json({ message: err.statusMessage });
  }
});

export default router;

/**
 * GET /api/mixpanel/tracks/devices
 */
router.get('/tracks/devices', authenticate, async (req, res, next) => {
  try {
    const clientId = await MixPanelService.getClientIdByUserId(req.userId);
    const devices = await MixPanelService.getMaxDevices(clientId, req.query.get, req.query.table);
    if (devices) {
      res.status(200).json(devices);
    }
  } catch (err) {
    res.status(err.status).json({ message: err.statusMessage });
  }
});
router.get('/pages/paths', authenticate, async (req, res, next) => {
  try {
    console.log('i am ', req.query);
    if (req.userId) {
      const devices = await MixPanelService.getMaxPaths(req.query.get, req.query.table);
      if (devices) {
        res.status(200).json(devices);
      }
    }
  } catch (err) {
    res.status(err.status).json({ message: err.statusMessage });
  }
});

/**
 * GET /api/mixpanel/total/users to get total user with count of last two weeks for comparision
 */
router.get('/total/users', authenticate, async (req, res, next) => {
  try {
    const clientId = await MixPanelService.getClientIdByUserId(req.userId);
    const totalUserData = await MixPanelService.getTotalUserData(clientId);
    res.status(200).json(totalUserData);
  } catch (err) {
    console.log(err);
    res.status(err.status).json(err.statusMessage);
  }
});

/**
 * GET /api/mixpanel/total/users to get total user with count of last two weeks for comparision
 */
router.get('/average/users', authenticate, async (req, res, next) => {
  try {
    const averageUser = await MixPanelService.getAverageUser();
    res.json(averageUser);
  } catch (err) {
    console.log(err);
    res.status(err.status).json(err.statusMessage);
  }
});

/**
 * GET /api/mixpanel/dashboard to get all the metadata details to show in dashboard
 */

router.get('/dashboard', authenticate, async (req, res, next) => {
  try {
    const clientId = await MixPanelService.getClientIdByUserId(req.userId);
    const averageUser = await MixPanelService.getAverageUser(clientId);
    const allMetadata = await MixPanelService.getAllMetaData(clientId);
    const totalUserData = await MixPanelService.getTotalUserData(clientId);

    res.json({
      averageUser,
      totalUserData,
      allMetadata,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get('/tracks/analytics', authenticate, async (req, res, next) => {
  try {
    const clientId = await MixPanelService.getClientIdByUserId(req.userId);
    const data = await MixPanelService.getTrackAnalytics(clientId, req.query);
    res.json({
      data,
      meta: data.pagination,
    });
  } catch (err) {
    console.log(err);
    res.status(err.status).json(err.statusMessage);
  }
});

router.get('/pages/analytics', authenticate, async (req, res, next) => {
  try {
    const clientId = await MixPanelService.getClientIdByUserId(req.userId);
    const data = await MixPanelService.getPageAnalytics(clientId, req.query);
    res.json({
      data,
      meta: data.pagination,
    });
  } catch (err) {
    console.log(err);
    res.status(err.status).json(err.statusMessage);
  }
});
