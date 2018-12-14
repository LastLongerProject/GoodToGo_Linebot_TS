import { headerTemplate, separatorTemplate, FlexMessage, spacerTemplate } from "../models/flexMessage"
class QrcodeView {
    private header = headerTemplate();
    private separator = separatorTemplate();
    private spacer = spacerTemplate()
    private baseUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=";
    private insertDash: String;

    constructor(phone: string) {
        this.header.setContents([this.headerText]);
        this.separator.setMargin(FlexMessage.Margin.xl);
        this.insertDash = phone.substring(0, 4) + "-" + phone.substring(4, 7) + "-" + phone.substring(7);
        this.qrcode.url = this.baseUrl + phone;
        this.phoneObj.text = this.insertDash
        this.initialView();
    }

    private initialView() {
        this.view.body.contents.push(this.phoneObj);
        this.view.body.contents.push(this.qrcode);
        this.view.body.contents.push(this.spacer.getSpacer());
    }

    private qrcode = {
        type: 'image',
        url: "",
        margin: FlexMessage.Margin.xxl,
        size: FlexMessage.Margin.xl
    }

    private phoneObj = {
        type: FlexMessage.ComponetType.text,
        text: this.insertDash,
        size: FlexMessage.Size.md,
        align: FlexMessage.Align.center
    }


    private headerText = {
        type: FlexMessage.ComponetType.text,
        text: "我的會員卡",
        size: FlexMessage.Size.xl,
        weight: FlexMessage.Weight.bold,
        color: "#ffffff"
    };

    private body = {
        type: FlexMessage.ComponetType.box,
        layout: FlexMessage.Layout.vertical,
        spacing: FlexMessage.Spacing.lg,
        contents: Array<any>()
    };

    private footerText = {
        type: FlexMessage.ComponetType.text,
        text: "請將手機提供給店舖夥伴掃描",
        color: "#484848",
        align: FlexMessage.Align.center,
        margin: FlexMessage.Margin.lg
    };

    private footer = {
        type: FlexMessage.ComponetType.box,
        layout: FlexMessage.Layout.vertical,
        contents: [this.separator.getSeparator(), this.footerText]
    };

    private styles = {
        header: {
            backgroundColor: "#00bbdc"
        }
    };

    private view = {
        type: FlexMessage.Container.bubble,
        header: this.header.getHeader(),
        body: this.body,
        footer: this.footer,
        styles: this.styles
    }

    public getView() {
        return {
            type: "flex",
            altText: "我的會員卡",
            contents: this.view
        };
    }
};

export { QrcodeView };