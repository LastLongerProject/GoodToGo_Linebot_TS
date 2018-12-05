import { isMobilePhone } from "../../lib/tool";
import * as request from '../../lib/request';
import { DataType, RewardType, DatabaseState, BindState, RegisterState } from '../../lib/enumManager';
import * as client from '../delegate/client';
import { getData } from "../../models/serviceProcess";
import { FlexMessage } from "../../etl/models/flexMessage";
import { getDataEvent } from "../delegate/event";


function postbackHandler(event, postbackData) {
    if (isMobilePhone(postbackData)) {
        logFactory.log(postbackData);
        return request.register(event, postbackData);
    } else if (postbackData === RegisterState.NO) {
        let message = '期待您成為好合器會員！';
        return client.textMessage(event, message);
    } else if (
        postbackData === DataType.GET_MORE_RECORD.toString() ||
        postbackData === DataType.IN_USED.toString() ||
        postbackData === DataType.RECORD.toString() ||
        postbackData === DataType.GET_MORE_INUSED.toString()
    ) {
        return getDataEvent(event, postbackData);
    } else if (
        postbackData === RewardType.LOTTERY ||
        postbackData === RewardType.REDEEM
    ) {
        return getRewardImage(event, postbackData);
    }
}

function getRewardImage(event, type) {
    let lotteryImage = 'https://i.imgur.com/MwljlRm.jpg';
    let redeemImgae = 'https://imgur.com/l2xiXxb.jpg';

    let url = type === RewardType.LOTTERY ? lotteryImage : redeemImgae;
    let image = {
        type: FlexMessage.ComponetType.image,
        originalContentUrl: url,
        previewImageUrl: url,
    };

    return client.customMessage(event, image);
}

export { postbackHandler }