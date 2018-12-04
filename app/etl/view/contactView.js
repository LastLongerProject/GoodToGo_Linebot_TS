"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flexMessage_1 = require("../models/flexMessage");
class ContactView {
    constructor() {
        this.separator = flexMessage_1.separatorTemplate();
        this.headerText = {
            type: flexMessage_1.FlexMessage.ComponetType.text,
            text: "聯絡好盒器",
            size: flexMessage_1.FlexMessage.Size.xl,
            weight: flexMessage_1.FlexMessage.Weight.bold,
            color: "#ffffff"
        };
        this.header = {
            type: "box",
            layout: flexMessage_1.FlexMessage.Layout.vertical,
            contents: [this.headerText]
        };
        this.footerButton_fb = {
            type: flexMessage_1.FlexMessage.ComponetType.button,
            action: {
                type: "uri",
                label: "好盒器 FB 粉絲專頁",
                uri: "https://www.facebook.com/good.to.go.tw"
            },
            style: "link",
            color: "#8FD5E8"
        };
        this.footer = {
            type: flexMessage_1.FlexMessage.ComponetType.box,
            layout: flexMessage_1.FlexMessage.Layout.vertical,
            contents: [this.footerButton_fb]
        };
        this.styles = {
            header: {
                backgroundColor: "#00bbdc"
            }
        };
        this.view = {
            type: flexMessage_1.FlexMessage.Container.bubble,
            header: this.header,
            footer: this.footer,
            styles: this.styles
        };
        this.separator.setMargin(flexMessage_1.FlexMessage.Margin.none);
    }
    pushBodyContent(containerType, dateAndStore) { }
    pushTimeBar(label) { }
    pushSeparator() { }
    getView() {
        return {
            type: "flex",
            altText: "聯絡好盒器",
            contents: this.view
        };
    }
}
exports.ContactView = ContactView;
;
//# sourceMappingURL=contactView.js.map