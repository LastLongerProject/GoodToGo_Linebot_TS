"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flexMessage_1 = require("../models/flexMessage");
class RecordView {
    constructor() {
        this.header = flexMessage_1.headerTemplate();
        this.separator = flexMessage_1.separatorTemplate();
        this.headerText = {
            type: flexMessage_1.FlexMessage.ComponetType.text,
            text: "歷史紀錄",
            size: flexMessage_1.FlexMessage.Size.xl,
            weight: flexMessage_1.FlexMessage.Weight.bold,
            color: "#ffffff"
        };
        this.footerButton_getMore = {
            type: flexMessage_1.FlexMessage.ComponetType.button,
            action: {
                type: "postback",
                label: "顯示更多",
                data: String("get more record from database" /* GET_MORE_RECORD */),
                displayText: "顯示更多"
            },
            style: "link",
            color: "#8FD5E8"
        };
        this.footerButton_getInused = {
            type: flexMessage_1.FlexMessage.ComponetType.button,
            action: {
                type: "postback",
                label: "查看使用中容器",
                data: String("in used" /* IN_USED */),
                displayText: "查看使用中容器"
            },
            style: "link",
            color: "#8FD5E8"
        };
        this.footer = {
            type: flexMessage_1.FlexMessage.ComponetType.box,
            layout: flexMessage_1.FlexMessage.Layout.vertical,
            contents: [this.separator.getSeparator(), this.footerButton_getMore, this.footerButton_getInused]
        };
        this.styles = {
            header: {
                backgroundColor: "#00bbdc"
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
            header: this.header.getHeader(),
            body: this.body,
            footer: this.footer,
            styles: this.styles
        };
        this.header.setContents([this.headerText]);
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
            altText: "使用容器數量",
            contents: this.view
        };
    }
}
exports.RecordView = RecordView;
;
//# sourceMappingURL=recordView.js.map