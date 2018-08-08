import { Router } from 'express';
import * as MixPanelService from '../services/mixPanelService';
import { META_DATA } from '../../data/metadata';
import { identyfyClient } from '../middlewares/identifyClient';

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
  try {
    const { email, ...rest } = req.body;
    console.log(email);

    if (req.identifiedClient) {
      // update metadata table
      const savedMetaData = await MixPanelService.saveMetaData(META_DATA);

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
    if (req.identifiedClient) {
      const savedMetaData = await MixPanelService.saveMetaData(META_DATA);
      const { id } = savedMetaData;
      const savedPagesData = await MixPanelService.savePageData(id, req.body);
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
export default router;
