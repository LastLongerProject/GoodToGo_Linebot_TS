"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flexMessage_1 = require("../models/flexMessage");
class ContrubtionView {
    constructor(tree, water, co2) {
        this.separator = flexMessage_1.separatorTemplate();
        this.image = {
            water: "https://imgur.com/c5Fs3UE.png",
            tree: "https://imgur.com/WoW1JPY.png",
            co2: "https://imgur.com/CX2OOg0.png"
        };
        this.headerText = [{
                type: flexMessage_1.FlexMessage.ComponetType.text,
                text: "您已減少",
                size: flexMessage_1.FlexMessage.Size.xl,
                weight: flexMessage_1.FlexMessage.Weight.bold,
                align: flexMessage_1.FlexMessage.Align.end,
                flex: 4,
                color: "#ffffff"
            }, {
                type: flexMessage_1.FlexMessage.ComponetType.text,
                text: "82",
                size: flexMessage_1.FlexMessage.Size.xl,
                weight: flexMessage_1.FlexMessage.Weight.bold,
                align: flexMessage_1.FlexMessage.Align.center,
                flex: 2,
                color: "#ffe552"
            }, {
                type: flexMessage_1.FlexMessage.ComponetType.text,
                text: "件垃圾",
                size: flexMessage_1.FlexMessage.Size.xl,
                weight: flexMessage_1.FlexMessage.Weight.bold,
                align: flexMessage_1.FlexMessage.Align.start,
                flex: 5,
                color: "#ffffff"
            }];
        this.header = {
            type: "box",
            layout: flexMessage_1.FlexMessage.Layout.horizontal,
            contents: this.headerText
        };
        this.styles = {
            header: {
                backgroundColor: "#00bbdc"
            }
        };
        this.body = {
            type: flexMessage_1.FlexMessage.ComponetType.box,
            layout: flexMessage_1.FlexMessage.Layout.vertical,
            spacing: flexMessage_1.FlexMessage.Spacing.xl,
            contents: Array()
        };
        this.view = {
            type: flexMessage_1.FlexMessage.Container.bubble,
            header: this.header,
            body: this.body,
            styles: this.styles
        };
        this.separator.setMargin(flexMessage_1.FlexMessage.Margin.lg);
        this.bodyContent = [
            {
                type: flexMessage_1.FlexMessage.ComponetType.text,
                text: "累計節省了",
                color: "#484848"
            },
            this.separator.getSeparator(),
            this.bodyCell(this.image.tree, "樹木", tree + " 棵"),
            this.separator.getSeparator(),
            this.bodyCell(this.image.water, "水", water + " 公升"),
            this.separator.getSeparator(),
            this.bodyCell(this.image.co2, "碳排放", co2 + " 公斤"),
            this.separator.getSeparator(),
            {
                type: flexMessage_1.FlexMessage.ComponetType.text,
                text: "謝謝您讓地球更美麗！：）",
                color: "#484848"
            }
        ];
        this.body.contents = this.bodyContent;
    }
    bodyCell(url, type, amount) {
        let image = {
            type: flexMessage_1.FlexMessage.ComponetType.image,
            url: url,
            size: flexMessage_1.FlexMessage.Size.xxs,
            align: flexMessage_1.FlexMessage.Align.start,
            gravity: flexMessage_1.FlexMessage.Gravity.center,
            flex: 1
        };
        let savingType = {
            type: flexMessage_1.FlexMessage.ComponetType.text,
            text: type,
            size: flexMessage_1.FlexMessage.Size.xs,
            color: "#484848",
            gravity: flexMessage_1.FlexMessage.Gravity.top,
            align: flexMessage_1.FlexMessage.Align.end,
            flex: 5
        };
        let savingAmount = {
            type: flexMessage_1.FlexMessage.ComponetType.text,
            text: amount,
            size: flexMessage_1.FlexMessage.Size.lg,
            color: "#484848",
            gravity: flexMessage_1.FlexMessage.Gravity.bottom,
            align: flexMessage_1.FlexMessage.Align.end,
            flex: 5
        };
        let text = {
            type: flexMessage_1.FlexMessage.ComponetType.box,
            layout: flexMessage_1.FlexMessage.Layout.vertical,
            contents: [savingType, savingAmount]
        };
        let cell = {
            type: flexMessage_1.FlexMessage.ComponetType.box,
            layout: flexMessage_1.FlexMessage.Layout.horizontal,
            contents: [
                image,
                text
            ]
        };
        return cell;
    }
    getView() {
        return {
            type: "flex",
            altText: "我的貢獻",
            contents: this.view
        };
    }
}
exports.ContrubtionView = ContrubtionView;
;
//# sourceMappingURL=contributionView.js.map