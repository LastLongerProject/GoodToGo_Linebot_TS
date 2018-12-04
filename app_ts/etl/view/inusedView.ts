import { headerTemplate, separatorTemplate, FlexMessage, addTimeBar, getBodyContent } from "../models/flexMessage"
import { View } from './view';
import { DataType } from '../../api/enumManager';
class InusedView implements View {

    private separator = separatorTemplate();
    constructor() { }
    private headerText = {
        type: FlexMessage.ComponetType.text,
        text: "使用中容器",
        size: FlexMessage.Size.xl,
        weight: FlexMessage.Weight.bold,
        color: "#ffffff"
    };

    private header = {
        type: "box",
        layout: FlexMessage.Layout.vertical,
        contents: [this.headerText]
    }
    private footerButton_getMore = {
        type: FlexMessage.ComponetType.button,
        action: {
            type: "postback",
            label: "顯示更多",
            data: DataType.GET_MORE_INUSED,
            displayText: "顯示更多"
        },
        style: "link",
        color: "#8FD5E8"
    };

    private footerButton_getRecord = {
        type: FlexMessage.ComponetType.button,
        action: {
            type: "postback",
            label: "查看已歸還容器",
            data: DataType.RECORD,
            displayText: "查看已歸還容器"
        },
        style: "link",
        color: "#8FD5E8"
    }

    private footer = {
        type: FlexMessage.ComponetType.box,
        layout: FlexMessage.Layout.vertical,
        contents: [this.separator.getSeparator(), this.footerButton_getMore, this.footerButton_getRecord]
    };

    private styles = {
        header: {
            backgroundColor: "#00bbdc"
        }
    };

    private body = {
        type: FlexMessage.ComponetType.box,
        layout: FlexMessage.Layout.vertical,
        spacing: FlexMessage.Spacing.xxl,
        contents: Array<any>()
    };
    private view = {
        type: FlexMessage.Container.bubble,
        header: this.header,
        body: this.body,
        footer: this.footer,
        styles: this.styles
    }

    public pushBodyContent(containerType: any, dateAndStore: String) {
        this.view.body.contents.push(getBodyContent(containerType, dateAndStore));
    }

    public pushTimeBar(label: String) {
        this.view.body.contents.push(addTimeBar(label));
    }

    public pushSeparator() {
        this.view.body.contents.push(this.separator.getSeparator());
    }

    public getView() {
        return {
            type: "flex",
            altText: "使用中容器",
            contents: this.view
        };
    }
};

export { InusedView };

