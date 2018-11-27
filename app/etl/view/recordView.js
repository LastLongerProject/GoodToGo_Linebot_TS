"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../models/container");
const flexMessage_1 = require("../models/flexMessage");
class RecordView {
    constructor() {
        this.header = flexMessage_1.headerTemplate();
        this.separator = flexMessage_1.separatorTemplate();
        this.headerText = {
            type: flexMessage_1.FlexMessage.ComponetType.text,
            text: "使用中容器",
            size: flexMessage_1.FlexMessage.Size.xl,
            weight: flexMessage_1.FlexMessage.Weight.bold,
            color: "#ffffff"
        };
        this.footerButton = {
            type: flexMessage_1.FlexMessage.ComponetType.button,
            action: {
                type: "postback",
                label: "顯示更多",
                data: "getMoreRecord",
                displayText: "顯示更多"
            },
            style: "link",
            color: "#8FD5E8"
        };
        this.footer = {
            type: flexMessage_1.FlexMessage.ComponetType.box,
            layout: flexMessage_1.FlexMessage.Layout.vertical,
            contents: [this.separator.getSeparator(), this.footerButton]
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
        this.view.body.contents.push(getBodyContent(containerType, dateAndStore));
    }
    pushTimeBar(label) {
        this.view.body.contents.push(addTimeBar(label));
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
function getBodyContent(containerType, dateAndStore) {
    return {
        type: flexMessage_1.FlexMessage.ComponetType.box,
        layout: flexMessage_1.FlexMessage.Layout.horizontal,
        contents: [{
                type: flexMessage_1.FlexMessage.ComponetType.image,
                url: container_1.container[containerType].imageUrl,
                size: flexMessage_1.FlexMessage.Size.xs,
                gravity: flexMessage_1.FlexMessage.Gravity.center,
                flex: 1
            }, {
                type: flexMessage_1.FlexMessage.ComponetType.text,
                text: container_1.container[containerType].name,
                size: flexMessage_1.FlexMessage.Size.md,
                color: "#565656",
                gravity: flexMessage_1.FlexMessage.Gravity.center,
                align: flexMessage_1.FlexMessage.Align.start,
                weight: flexMessage_1.FlexMessage.Weight.bold,
                flex: 4
            }, {
                type: flexMessage_1.FlexMessage.ComponetType.text,
                text: dateAndStore,
                size: flexMessage_1.FlexMessage.Size.xs,
                color: "#C0C0C8",
                wrap: true,
                gravity: flexMessage_1.FlexMessage.Gravity.bottom,
                align: flexMessage_1.FlexMessage.Align.end,
                flex: 5
            }]
    };
}
function addTimeBar(date) {
    return {
        type: flexMessage_1.FlexMessage.ComponetType.text,
        text: date,
        size: flexMessage_1.FlexMessage.Size.md,
        weight: flexMessage_1.FlexMessage.Weight.bold,
        color: "#04B7E6"
    };
}
//# sourceMappingURL=recordView.js.map