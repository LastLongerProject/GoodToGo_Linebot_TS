import * as express from 'express';
import { middleware } from '@line/bot-sdk';

const router = express.Router();
const eventHandler = require('../controller/eventHandler');
const logFactory = require('../lib/logFactory')('linebot:webhook/linebot');

router.post('/', middleware(global.gConfig.bot), (req, res) => {
    Promise
        .all(req.body.events.map(eventHandler.bot))
        .then(result => res.json(result))
        .catch(err => logFactory.error(err));
});

export { router as linebot }