"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flexMessage_1 = require("../models/flexMessage");
const container_1 = require("../models/container");
class InusedView {
    constructor(amount) {
        this.name = "使用中容器";
        this.post_getMore = "get more in used container from database" /* GET_MORE_INUSED */;
        this.post_getAnother = "record" /* RECORD */;
        this.separator = {
            type: "separator",
            margin: flexMessage_1.FlexMessage.Margin.none
        };
        this.headerText = {
            type: flexMessage_1.FlexMessage.ComponetType.text,
            text: name,
            size: flexMessage_1.FlexMessage.Size.xl,
            weight: flexMessage_1.FlexMessage.Weight.bold,
            gravity: flexMessage_1.FlexMessage.Gravity.center,
            color: "#ffffff"
        };
        this.header = {
            type: "box",
            layout: flexMessage_1.FlexMessage.Layout.horizontal,
            contents: [this.headerText]
        };
        this.body = {
            type: flexMessage_1.FlexMessage.ComponetType.box,
            layout: flexMessage_1.FlexMessage.Layout.vertical,
            spacing: flexMessage_1.FlexMessage.Spacing.lg,
            contents: Array()
        };
        this.footerButton_getMore = {
            type: flexMessage_1.FlexMessage.ComponetType.button,
            action: {
                type: "postback",
                label: "顯示更多",
                data: this.post_getMore,
                displayText: "顯示更多"
            },
            style: "link",
            color: "#8FD5E8"
        };
        this.footerButton_getAnother = {
            type: flexMessage_1.FlexMessage.ComponetType.button,
            action: {
                type: "postback",
                label: "查看已歸還容器",
                data: this.post_getAnother,
                displayText: "查看已歸還容器"
            },
            style: "link",
            color: "#8FD5E8"
        };
        this.footer = {
            type: flexMessage_1.FlexMessage.ComponetType.box,
            layout: flexMessage_1.FlexMessage.Layout.vertical,
            contents: [this.separator, this.footerButton_getMore, this.separator, this.footerButton_getAnother]
        };
        this.styles = {
            header: {
                backgroundColor: "#00bbdc"
            }
        };
        this.view = {
            type: flexMessage_1.FlexMessage.Container.bubble,
            header: this.header,
            body: this.body,
            footer: this.footer,
            styles: this.styles
        };
        this.inusedAmount = {
            type: flexMessage_1.FlexMessage.ComponetType.text,
            text: amount,
            size: flexMessage_1.FlexMessage.Size.xl,
            weight: flexMessage_1.FlexMessage.Weight.bold,
            align: flexMessage_1.FlexMessage.Align.end,
            gravity: flexMessage_1.FlexMessage.Gravity.center,
            color: "#ffe552"
        };
        this.header.contents.push(this.inusedAmount);
    }
    bodyContent(containerType, containerId, info_1, info_2) {
        return {
            type: flexMessage_1.FlexMessage.ComponetType.box,
            layout: flexMessage_1.FlexMessage.Layout.horizontal,
            contents: [{
                    type: flexMessage_1.FlexMessage.ComponetType.image,
                    url: container_1.container[containerType].imageUrl,
                    size: flexMessage_1.FlexMessage.Size.xl,
                    gravity: flexMessage_1.FlexMessage.Gravity.center,
                    flex: 2
                },
                {
                    type: flexMessage_1.FlexMessage.ComponetType.box,
                    layout: flexMessage_1.FlexMessage.Layout.vertical,
                    margin: flexMessage_1.FlexMessage.Margin.lg,
                    flex: 8,
                    contents: [{
                            type: flexMessage_1.FlexMessage.ComponetType.text,
                            text: container_1.container[containerType].name,
                            size: flexMessage_1.FlexMessage.Size.md,
                            color: "#565656",
                            gravity: flexMessage_1.FlexMessage.Gravity.center,
                            align: flexMessage_1.FlexMessage.Align.start,
                            weight: flexMessage_1.FlexMessage.Weight.bold
                        }, {
                            type: flexMessage_1.FlexMessage.ComponetType.text,
                            text: containerId,
                            size: flexMessage_1.FlexMessage.Size.xxs,
                            color: "#484848",
                            margin: flexMessage_1.FlexMessage.Margin.xs,
                            gravity: flexMessage_1.FlexMessage.Gravity.center,
                            align: flexMessage_1.FlexMessage.Align.start
                        }]
                }, {
                    type: flexMessage_1.FlexMessage.ComponetType.box,
                    layout: flexMessage_1.FlexMessage.Layout.vertical,
                    margin: flexMessage_1.FlexMessage.Margin.none,
                    flex: 10,
                    contents: [{
                            type: flexMessage_1.FlexMessage.ComponetType.text,
                            text: info_1,
                            size: flexMessage_1.FlexMessage.Size.xxs,
                            color: "#C0C0C8",
                            align: flexMessage_1.FlexMessage.Align.end,
                        }, {
                            type: flexMessage_1.FlexMessage.ComponetType.text,
                            text: info_2,
                            size: flexMessage_1.FlexMessage.Size.xxs,
                            color: "#C0C0C8",
                            gravity: flexMessage_1.FlexMessage.Gravity.bottom,
                            margin: flexMessage_1.FlexMessage.Margin.md,
                            align: flexMessage_1.FlexMessage.Align.end,
                        }]
                }]
        };
    }
    pushBodyContent(containerType, containerId, date, store) {
        this.view.body.contents.push(this.bodyContent(containerType, containerId, date, store));
    }
    pushTimeBar(label) {
        this.view.body.contents.push(flexMessage_1.addTimeBar(label));
    }
    pushSeparator(margin) {
        let separator = {
            type: "separator",
            margin: margin
        };
        this.view.body.contents.push(separator);
    }
    addIndexToFooterButtonLabel(index) {
        this.footerButton_getMore.action.label += index;
    }
    deleteGetmoreButton() {
        this.footer.contents.splice(1, 1);
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