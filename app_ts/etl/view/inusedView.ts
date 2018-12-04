import { headerTemplate, separatorTemplate, FlexMessage, addTimeBar, getBodyContent } from "../models/flexMessage"
import { View } from './view';
import { DataType } from '../../api/enumManager';
class InusedView implements View {
    private header = headerTemplate();
    private separator = separatorTemplate();
    constructor() {
        this.header.setContents([this.headerText]);
    }
    private headerText = {
        type: FlexMessage.ComponetType.text,
        text: "使用中容器",
        size: FlexMessage.Size.xl,
        weight: FlexMessage.Weight.bold,
        color: "#ffffff"
    };
    private footerButton_getMore = {
        type: FlexMessage.ComponetType.button,
        action: {
            type: "postback",
            label: "顯示更多",
            data: String(DataType.GET_MORE_INUSED),
            displayText: "顯示更多"
        },
        style: "link",
        color: "#8FD5E8"
    };

    private footerButton_getRecord = {
        type: FlexMessage.ComponetType.button,
        action: {
            type: "postback",
            label: "查看歷史紀錄",
            data: String(DataType.RECORD),
            displayText: "查看歷史紀錄"
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
            altText: "使用容器數量",
            contents: this.view
        };
    }
};

export { InusedView };

