"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client = require('./clientDelegate');
const goodtogoEvent = require('./linebotEvent');
class EventApi {
    constructor() { }
    followEvent(event) {
        console.log("hi");
        client.textMessage(event, goodtogoEvent.FollowEvent.message);
    }
}
exports.default = EventApi;
//# sourceMappingURL=eventApi.js.map