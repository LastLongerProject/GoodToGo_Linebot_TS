import { separatorTemplate, FlexMessage } from '../models/flexMessage';
class ContactView {
    private separator = separatorTemplate();
    private headerText = {
        type: FlexMessage.ComponetType.text,
        text: "聯絡好盒器",
        size: FlexMessage.Size.xl,
        weight: FlexMessage.Weight.bold,
        color: "#ffffff"
    };

    private header = {
        type: "box",
        layout: FlexMessage.Layout.vertical,
        contents: [this.headerText]
    }
    private footerButton_fb = {
        type: FlexMessage.ComponetType.button,
        action: {
            type: "uri",
            label: "好盒器 FB 粉絲專頁",
            uri: "https://www.facebook.com/good.to.go.tw"
        },
        style: "link",
        color: "#8FD5E8"
    };

    private footer = {
        type: FlexMessage.ComponetType.box,
        layout: FlexMessage.Layout.vertical,
        contents: [this.footerButton_fb]
    };

    private styles = {
        header: {
            backgroundColor: "#00bbdc"
        }
    };

    private view = {
        type: FlexMessage.Container.bubble,
        header: this.header,
        footer: this.footer,
        styles: this.styles
    }

    constructor() {
        this.separator.setMargin(FlexMessage.Margin.none);
    }

    public getView() {
        return {
            type: "flex",
            altText: "聯絡好盒器",
            contents: this.view
        };
    }
};

export { ContactView };

