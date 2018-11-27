import { container } from "../models/container"
import { headerTemplate, separatorTemplate, FlexMessage } from "../models/flexMessage"
class RecordView {
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
    private footerButton = {
        type: FlexMessage.ComponetType.button,
        action: {
            type: "postback",
            label: "顯示更多",
            data: "getMoreRecord",
            displayText: "顯示更多"
        },
        style: "link",
        color: "#8FD5E8"
    };

    private footer = {
        type: FlexMessage.ComponetType.box, 
        layout: FlexMessage.Layout.vertical,
        contents:[this.separator.getSeparator(), this.footerButton]
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

export {RecordView};

function getBodyContent(containerType, dateAndStore: String): any{
    return {
        type: FlexMessage.ComponetType.box,
        layout: FlexMessage.Layout.horizontal,
        contents: [{
            type: FlexMessage.ComponetType.image,
            url: container[containerType].imageUrl,
            size: FlexMessage.Size.xs,
            gravity: FlexMessage.Gravity.center,
            flex: 1
        }, {
            type: FlexMessage.ComponetType.text,
            text: container[containerType].name,
            size: FlexMessage.Size.md,
            color: "#565656",
            gravity: FlexMessage.Gravity.center,
            align: FlexMessage.Align.start,
            weight: FlexMessage.Weight.bold,
            flex: 4
        }, {
            type: FlexMessage.ComponetType.text,
            text: dateAndStore,
            size: FlexMessage.Size.xs,
            color: "#C0C0C8",
            wrap: true,
            gravity: FlexMessage.Gravity.bottom,
            align: FlexMessage.Align.end,
            flex: 5
        }]
    };
}

function addTimeBar(date: String) {
    return {
        type: FlexMessage.ComponetType.text,
        text: date,
        size: FlexMessage.Size.md,
        weight: FlexMessage.Weight.bold,
        color: "#04B7E6"
    }
}