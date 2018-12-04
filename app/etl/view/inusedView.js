"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flexMessage_1 = require("../models/flexMessage");
class InusedView {
    constructor() {
        this.separator = flexMessage_1.separatorTemplate();
        this.headerText = {
            type: flexMessage_1.FlexMessage.ComponetType.text,
            text: "使用中容器",
            size: flexMessage_1.FlexMessage.Size.xl,
            weight: flexMessage_1.FlexMessage.Weight.bold,
            color: "#ffffff"
        };
        this.header = {
            type: "box",
            layout: flexMessage_1.FlexMessage.Layout.vertical,
            contents: [this.headerText]
        };
        this.footerButton_getMore = {
            type: flexMessage_1.FlexMessage.ComponetType.button,
            action: {
                type: "postback",
                label: "顯示更多",
                data: "get more in used container from database" /* GET_MORE_INUSED */,
                displayText: "顯示更多"
            },
            style: "link",
            color: "#8FD5E8"
        };
        this.footerButton_getRecord = {
            type: flexMessage_1.FlexMessage.ComponetType.button,
            action: {
                type: "postback",
                label: "查看歷史紀錄",
                data: "record" /* RECORD */,
                displayText: "查看歷史紀錄"
            },
            style: "link",
            color: "#8FD5E8"
        };
        this.footer = {
            type: flexMessage_1.FlexMessage.ComponetType.box,
            layout: flexMessage_1.FlexMessage.Layout.vertical,
            contents: [this.separator.getSeparator(), this.footerButton_getMore, this.footerButton_getRecord]
        };
        this.styles = {
            header: {
                backgroundColor: "#00bbdc"
            }
        };
        this.body = {
            type: flexMessage_1.FlexMessage.ComponetType.box,
            layout: flexMessage_1.FlexMessage.Layout.vertical,
            spacing: flexMessage_1.FlexMessage.Spacing.xxl,
            contents: Array()
        };
        this.view = {
            type: flexMessage_1.FlexMessage.Container.bubble,
            header: this.header,
            body: this.body,
            footer: this.footer,
            styles: this.styles
        };
    }
    pushBodyContent(containerType, dateAndStore) {
        this.view.body.contents.push(flexMessage_1.getBodyContent(containerType, dateAndStore));
    }
    pushTimeBar(label) {
        this.view.body.contents.push(flexMessage_1.addTimeBar(label));
    }
    pushSeparator() {
        this.view.body.contents.push(this.separator.getSeparator());
    }
    getView() {
        return {
            type: "flex",
            altText: "使用中容器",
            contents: this.view
        };
    }
}
exports.InusedView = InusedView;
;
//# sourceMappingURL=inusedView.js.map