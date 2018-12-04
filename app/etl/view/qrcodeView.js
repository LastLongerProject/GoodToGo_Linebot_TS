"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flexMessage_1 = require("../models/flexMessage");
class QrcodeView {
    constructor(phone) {
        this.header = flexMessage_1.headerTemplate();
        this.separator = flexMessage_1.separatorTemplate();
        this.spacer = flexMessage_1.spacerTemplate();
        this.baseUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=";
        this.qrcode = {
            type: 'image',
            url: "",
            margin: flexMessage_1.FlexMessage.Margin.xxl,
            size: flexMessage_1.FlexMessage.Margin.xl
        };
        this.phoneObj = {
            type: flexMessage_1.FlexMessage.ComponetType.text,
            text: this.insertDash,
            size: flexMessage_1.FlexMessage.Size.md,
            align: flexMessage_1.FlexMessage.Align.center
        };
        this.headerText = {
            type: flexMessage_1.FlexMessage.ComponetType.text,
            text: "我的會員卡",
            size: flexMessage_1.FlexMessage.Size.xl,
            weight: flexMessage_1.FlexMessage.Weight.bold,
            color: "#ffffff"
        };
        this.body = {
            type: flexMessage_1.FlexMessage.ComponetType.box,
            layout: flexMessage_1.FlexMessage.Layout.vertical,
            spacing: flexMessage_1.FlexMessage.Spacing.lg,
            contents: Array()
        };
        this.footerText = {
            type: flexMessage_1.FlexMessage.ComponetType.text,
            text: "請將手機提供給店舖夥伴掃描",
            color: "#484848",
            align: flexMessage_1.FlexMessage.Align.center,
            margin: flexMessage_1.FlexMessage.Margin.lg
        };
        this.footer = {
            type: flexMessage_1.FlexMessage.ComponetType.box,
            layout: flexMessage_1.FlexMessage.Layout.vertical,
            contents: [this.separator.getSeparator(), this.footerText]
        };
        this.styles = {
            header: {
                backgroundColor: "#00bbdc"
            }
        };
        this.view = {
            type: flexMessage_1.FlexMessage.Container.bubble,
            header: this.header.getHeader(),
            body: this.body,
            footer: this.footer,
            styles: this.styles
        };
        this.header.setContents([this.headerText]);
        this.separator.setMargin(flexMessage_1.FlexMessage.Margin.xl);
        this.insertDash = phone.substring(0, 4) + "-" + phone.substring(4, 7) + "-" + phone.substring(7);
        this.qrcode.url = this.baseUrl + phone;
        this.phoneObj.text = this.insertDash;
        this.initialView();
    }
    initialView() {
        this.view.body.contents.push(this.phoneObj);
        this.view.body.contents.push(this.qrcode);
        this.view.body.contents.push(this.spacer.getSpacer());
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
            altText: "我的會員卡",
            contents: this.view
        };
    }
}
exports.QrcodeView = QrcodeView;
;
//# sourceMappingURL=qrcodeView.js.map