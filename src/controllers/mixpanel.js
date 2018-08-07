import { Router } from 'express';
import * as MixPanelService from '../services/mixPanelService';
import { META_DATA } from '../../data/metadata';

const router = Router();

router.post('/identify', async (req, res, next) => {
  try {
    const clientId = req.get('clientId');
    const { email } = req.body;
    const identifiedClient = await MixPanelService.indentifyClient(clientId, email);
    if (identifiedClient) {
      // save data to the clientDetails
    }
    res.status(200).json(identifiedClient);
  } catch (err) {
    res.status(err.status).json({ message: err.statusMessage });
  }
});

router.post('/track', async (req, res, next) => {
  try {
    const clientId = req.get('clientId');
    const { email, eventName, payload } = req.body;

    const identifiedClient = await MixPanelService.indentifyClient(clientId, email);
    if (identifiedClient) {
      // update metadata table
      const savedMetaData = await MixPanelService.saveMetaData(META_DATA);
      if (savedMetaData) {
        // const savedTrackData = await
        const { id } = savedMetaData;
        const savedTrackData = await MixPanelService.saveTrackData(eventName, id, payload);
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

router.post('/page', async (req, res, next) => {
  try {
    const clientId = req.get('clientId');
    const { email } = req.body;

    const identifiedClient = await MixPanelService.indentifyClient(clientId, email);
    if (identifiedClient) {
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
