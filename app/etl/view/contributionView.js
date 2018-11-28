"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flexMessage_1 = require("../models/flexMessage");
const serviceProcess_1 = require("../../models/serviceProcess");
class ContrubtionView {
    constructor() {
        this.separator = flexMessage_1.separatorTemplate();
        this.spacer = flexMessage_1.spacerTemplate();
        this.footerButton_lottery = {
            type: flexMessage_1.FlexMessage.ComponetType.button,
            action: {
                type: "postback",
                label: "用 5 點好杯幣參加抽獎",
                data: String(serviceProcess_1.RewardType.Lottery),
                displayText: "用 5 點好杯幣參加抽獎"
            },
            style: "link",
            color: "#40B9D8"
        };
        this.footerButton_redeem = {
            type: flexMessage_1.FlexMessage.ComponetType.button,
            action: {
                type: "postback",
                label: "用 50 點好杯幣兌換飲料",
                data: String(serviceProcess_1.RewardType.Redeem),
                displayText: "用 50 點好杯幣兌換飲料"
            },
            style: "link",
            color: "#40B9D8"
        };
        this.footer = {
            type: flexMessage_1.FlexMessage.ComponetType.box,
            layout: flexMessage_1.FlexMessage.Layout.vertical,
            contents: [this.footerButton_lottery, this.separator.getSeparator(), this.footerButton_redeem]
        };
        this.bodyImage = {
            type: flexMessage_1.FlexMessage.ComponetType.image,
            url: "https://imgur.com/YZqrKDC.png",
            size: "full"
        };
        this.styles = {
            header: {
                backgroundColor: "#00bbdc"
            },
            footer: {
                separator: true
            }
        };
        this.body = {
            type: flexMessage_1.FlexMessage.ComponetType.box,
            layout: flexMessage_1.FlexMessage.Layout.vertical,
            spacing: flexMessage_1.FlexMessage.Spacing.lg,
            contents: Array()
        };
        this.view = {
            type: flexMessage_1.FlexMessage.Container.bubble,
            body: this.body,
            footer: this.footer,
            styles: this.styles
        };
        this.separator.setMargin(flexMessage_1.FlexMessage.Margin.none);
        this.view.body.contents.push(this.bodyImage);
    }
    pushBodyContent(data) {
        this.view.body.contents.push(data);
    }
    pushTimeBar(label) {
        this.view.body.contents.push(flexMessage_1.addTimeBar(label));
    }
    pushSeparator() {
        this.view.body.contents.push(this.separator.getSeparator());
    }
    pushSpacer() {
        this.view.body.contents.push(this.spacer.getSpacer());
    }
    getView() {
        return {
            type: "flex",
            altText: "使用容器數量",
            contents: this.view
        };
    }
}
exports.ContrubtionView = ContrubtionView;
;
//# sourceMappingURL=contributionView.js.map