import { Router } from 'express';
import * as MixPanelService from '../services/mixPanelService';
import { identyfyClient } from '../middlewares/identifyClient';
import { authenticate } from '../middlewares/auth';

const router = Router();

/**
 * @argument req
 * @response status and jsonindentifyClient
 */
router.post('/identify', identyfyClient, (req, res, next) => {
  try {
    if (req.identifiedClient) {
      res.status(200).json(req.identifiedClient);
    }
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
    const { email, ...rest } = req.body.trackData;
    console.log(email);

    if (req.identifiedClient) {
      // update metadata table
      const savedMetaData = await MixPanelService.saveMetaData(req.clientId, req.clientIp, req.body.metaData);

      if (savedMetaData) {
        const { id } = savedMetaData;
        const savedTrackData = await MixPanelService.saveTrackData(id, rest);
        if (savedTrackData) {
          res.status(200).json({
            savedMetaData,
            savedTrackData,
          });
        }
      }
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
    const { email, ...rest } = req.body.pageData;
    console.log(email);
    if (req.identifiedClient) {
      const savedMetaData = await MixPanelService.saveMetaData(req.clientId, req.clientIp, req.body.metaData);
      const { id } = savedMetaData;
      const savedPagesData = await MixPanelService.savePageData(id, rest);
      if (savedPagesData) {
        res.status(200).json({
          savedMetaData,
          savedPagesData,
        });
      }
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
    console.log('useridddddddddddddddddd', req.userId);
    const clientId = await MixPanelService.getClientIdByUserId(req.userId);
    console.log('client id from mixpanel controller', clientId);
    if (clientId) {
      const tracksWithMeta = await MixPanelService.getAllTracks(clientId, req.query);
      if (tracksWithMeta) {
        res.status(200).json({
          tracksWithMeta,
        });
      }
    }
  } catch (err) {
    res.status(err.status).json({ message: err.statusMessage });
  }
});

router.get('/pages', identyfyClient, async (req, res, next) => {
  try {
    if (req.identifiedClient) {
      const pagesWithMeta = await MixPanelService.getAllPages(req.clientId, req.query);
      if (pagesWithMeta) {
        res.status(200).json(pagesWithMeta);
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
router.get('/tracks/devices', identyfyClient, async (req, res, next) => {
  try {
    if (req.identifiedClient) {
      const devices = await MixPanelService.getMaxDevices();
      if (devices) {
        res.status(200).json(devices);
      }
    }
  } catch (err) {
    res.status(err.status).json({ message: err.statusMessage });
  }
});
