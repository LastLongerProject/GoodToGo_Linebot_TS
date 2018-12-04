import { View } from "./view"
import { headerTemplate, separatorTemplate, FlexMessage, addTimeBar, getBodyContent } from "../models/flexMessage"
import { DataType } from '../../api/enumManager';
class RecordView implements View {
    private header = headerTemplate();
    private separator = separatorTemplate();
    constructor() {
        this.header.setContents([this.headerText]);
    }
    private headerText = {
        type: FlexMessage.ComponetType.text,
        text: "歷史紀錄",
        size: FlexMessage.Size.xl,
        weight: FlexMessage.Weight.bold,
        color: "#ffffff"
    };
    private footerButton_getMore = {
        type: FlexMessage.ComponetType.button,
        action: {
            type: "postback",
            label: "顯示更多",
            data: DataType.GET_MORE_RECORD,
            displayText: "顯示更多"
        },
        style: "link",
        color: "#8FD5E8"
    };

    private footerButton_getInused = {
        type: FlexMessage.ComponetType.button,
        action: {
            type: "postback",
            label: "查看使用中容器",
            data: DataType.IN_USED,
            displayText: "查看使用中容器"
        },
        style: "link",
        color: "#8FD5E8"
    }

    private footer = {
        type: FlexMessage.ComponetType.box,
        layout: FlexMessage.Layout.vertical,
        contents: [this.separator.getSeparator(), this.footerButton_getMore, this.footerButton_getInused]
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

export { RecordView };
