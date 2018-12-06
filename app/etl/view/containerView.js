"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flexMessage_1 = require("../models/flexMessage");
const container_1 = require("../models/container");
class ContainerStateView {
    constructor(name, amount) {
        this.separator = {
            type: "separator",
            margin: flexMessage_1.FlexMessage.Margin.none
        };
        this.spacer = {
            type: "spacer",
            size: flexMessage_1.FlexMessage.Size.sm
        };
        this.inusedAmount = {
            type: flexMessage_1.FlexMessage.ComponetType.text,
            text: "",
            size: flexMessage_1.FlexMessage.Size.xl,
            weight: flexMessage_1.FlexMessage.Weight.bold,
            align: flexMessage_1.FlexMessage.Align.end,
            gravity: flexMessage_1.FlexMessage.Gravity.center,
            color: "#ffe552"
        };
        this.headerText = {
            type: flexMessage_1.FlexMessage.ComponetType.text,
            text: "",
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
        this.footerButton_getMore = {
            type: flexMessage_1.FlexMessage.ComponetType.button,
            action: {
                type: "postback",
                label: "查看",
                data: "",
                displayText: "查看"
            },
            style: "link",
            color: "#8FD5E8"
        };
        this.footerButton_getAnother = {
            type: flexMessage_1.FlexMessage.ComponetType.button,
            action: {
                type: "postback",
                label: "查看",
                data: "",
                displayText: "查看"
            },
            style: "link",
            color: "#8FD5E8"
        };
        this.footer = {
            type: flexMessage_1.FlexMessage.ComponetType.box,
            layout: flexMessage_1.FlexMessage.Layout.vertical,
            contents: [this.footerButton_getMore, this.separator, this.footerButton_getAnother]
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
            header: this.header,
            body: this.body,
            footer: this.footer,
            styles: this.styles
        };
        this.name = name;
        this.amount = amount;
        this.viewInit();
    }
    bodyContent(containerType, containerId, info_1, info_2) {
        let bodyContent = {
            type: flexMessage_1.FlexMessage.ComponetType.box,
            layout: flexMessage_1.FlexMessage.Layout.horizontal,
            contents: [{
                    type: flexMessage_1.FlexMessage.ComponetType.image,
                    url: container_1.container[containerType].imageUrl,
                    size: flexMessage_1.FlexMessage.Size.xl,
                    gravity: flexMessage_1.FlexMessage.Gravity.center,
                    flex: 1
                },
                {
                    type: flexMessage_1.FlexMessage.ComponetType.box,
                    layout: flexMessage_1.FlexMessage.Layout.vertical,
                    margin: flexMessage_1.FlexMessage.Margin.xxl,
                    flex: 4,
                    contents: [
                        this.spacer,
                        {
                            type: flexMessage_1.FlexMessage.ComponetType.text,
                            text: container_1.container[containerType].name,
                            size: flexMessage_1.FlexMessage.Size.md,
                            color: "#565656",
                            align: flexMessage_1.FlexMessage.Align.start,
                            weight: flexMessage_1.FlexMessage.Weight.bold
                        }, {
                            type: flexMessage_1.FlexMessage.ComponetType.text,
                            text: containerId,
                            size: flexMessage_1.FlexMessage.Size.xxs,
                            color: "#484848",
                            margin: flexMessage_1.FlexMessage.Margin.xs,
                            align: flexMessage_1.FlexMessage.Align.start
                        }
                    ]
                }, {
                    type: flexMessage_1.FlexMessage.ComponetType.box,
                    layout: flexMessage_1.FlexMessage.Layout.vertical,
                    margin: flexMessage_1.FlexMessage.Margin.none,
                    flex: 5,
                    contents: [{
                            type: flexMessage_1.FlexMessage.ComponetType.text,
                            text: info_1,
                            size: flexMessage_1.FlexMessage.Size.xxs,
                            color: "#C0C0C8",
                            gravity: flexMessage_1.FlexMessage.Gravity.bottom,
                            align: flexMessage_1.FlexMessage.Align.end
                        }, {
                            type: flexMessage_1.FlexMessage.ComponetType.text,
                            text: info_2,
                            size: flexMessage_1.FlexMessage.Size.xxs,
                            color: "#C0C0C8",
                            align: flexMessage_1.FlexMessage.Align.end,
                            wrap: true
                        }]
                }]
        };
        return bodyContent;
    }
    viewInit() {
        this.headerText.text = this.name;
        this.inusedAmount.text = this.amount;
        this.header.contents.push(this.inusedAmount);
    }
    setFootButton(getMore, getAnother) {
        let label_getAnother = getAnother === "in used" /* IN_USED */ ? "使用中容器" : "已歸還容器";
        this.footerButton_getAnother.action.label += label_getAnother;
        this.footerButton_getAnother.action.displayText += label_getAnother;
        this.footerButton_getAnother.action.data = getAnother;
        this.footerButton_getMore.action.data = getMore;
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
            altText: this.name,
            contents: this.view
        };
    }
}
exports.ContainerStateView = ContainerStateView;
//# sourceMappingURL=containerView.js.map