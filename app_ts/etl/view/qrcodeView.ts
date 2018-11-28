import { headerTemplate, separatorTemplate, FlexMessage, addTimeBar, getBodyContent, spacerTemplate } from "../models/flexMessage"
import { View } from './view';
class QrcodeView implements View {
    private header = headerTemplate();
    private separator = separatorTemplate();
    private spacer = spacerTemplate()
    constructor() {
        this.header.setContents([this.headerText]);
        this.separator.setMargin(FlexMessage.Margin.xl);
    }
    private headerText = {
        type: FlexMessage.ComponetType.text,
        text: "我的會員卡",
        size: FlexMessage.Size.xl,
        weight: FlexMessage.Weight.bold,
        color: "#ffffff"
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
        contents:[this.separator.getSeparator(), this.footerText]
    };

    private styles = {
        header: {
            backgroundColor: "#00bbdc"
        }
    };

    private body = {
        type: FlexMessage.ComponetType.box,
        layout: FlexMessage.Layout.vertical,
        spacing: FlexMessage.Spacing.lg,
        contents: Array<any>()
    };

    private view = {
        type: FlexMessage.Container.bubble,
        header: this.header.getHeader(),
        body: this.body,
        footer: this.footer,
        styles: this.styles
    }

    public pushBodyContent(data) {
        this.view.body.contents.push(data);
    }

    public pushTimeBar(label: String) {
        this.view.body.contents.push(addTimeBar(label));
    }

    public pushSeparator() {
        this.view.body.contents.push(this.separator.getSeparator());
    }

    public pushSpacer() {
        this.view.body.contents.push(this.spacer.getSpacer());
    }

    public getView() {
        return {
            type: "flex",
            altText: "使用容器數量",
            contents: this.view
        };
    }
};

export {QrcodeView};