import { container } from "../models/container"
import { headerTemplate, separatorTemplate, FlexMessage } from "../models/flexMessage"

let header = headerTemplate();
let separator = separatorTemplate();

let headerText = {
    type: FlexMessage.ComponetType.text,
    text: "使用中容器",
    size: FlexMessage.Size.xl,
    weight: FlexMessage.Weight.bold,
    color: "#ffffff"
};

header.setContents([headerText]);

let body = {
    type: FlexMessage.ComponetType.box,
    layout: FlexMessage.Layout.vertical,
    spacing: FlexMessage.Spacing.lg,
    contents: Array<any>()
};

let footerButton = {
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

let footer = {
    type: FlexMessage.ComponetType.box, 
    layout: FlexMessage.Layout.vertical,
    contents:[separator.getSeparator(), footerButton]
};

let styles = {
    header: {
        backgroundColor: "#00bbdc"
    }
};

function recordView(): void {
    let view = {
        type: FlexMessage.Container.bubble,
        header: header.getHeader(),
        body: body,
        footer: footer,
        styles: styles
    }

    function pushBodyContent(containerType: any, dateAndStore: String) {
        view.body.contents.push(getBodyContent(containerType, dateAndStore));
    }

    function pushTimeBar(label: String) {
        view.body.contents.push(addTimeBar(label));
    }

    function pushSeparator() {
        view.body.contents.push(separator.getSeparator());
    }

    function getView() {
        return {
            type: "flex",
            altText: "使用容器數量",
            contents: view
        };
    }

    return {
        pushBodyContent,
        pushTimeBar,
        getView,
        pushSeparator
    }
};

export {recordView};

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