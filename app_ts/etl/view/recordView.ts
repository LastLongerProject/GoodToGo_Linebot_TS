import { container } from "../models/container"

let headerText = {
    type: "text",
    text: "使用中容器",
    size: "xl",
    weight: "bold",
    color: "#ffffff"
};

let header = {
    type: "box",
    layout: "vertical",
    contents: [headerText]
};

let body = {
    type: "box",
    layout: "vertical",
    spacing: "lg",
    contents: []
};

let footerButton = {
    type: "button",
    layout: "horizontal",
    action: {
        type: "postback",
        label: "查看更多",
        data: "getMoreRecord",
        displayText: "查看更多"
    },
    style: "primary",
    color: "#0000ff"
};

let footer = {
    type: "box", 
    layout: "horizontal",
    contents:[footerButton]
};

let styles = {
    header: {
        backgroundColor: "#00bbdc"
    },
    footer: {
        separator: true
    }
};

let recordView = {
    type: "bubble",
    header: header,
    body: body,
    footer: footer,
    styles: styles
};

function getBodyContent(containerType, dateAndStore) {
    return {
        type: "box",
        layout: "horizontal",
        contents: [{
            type: "image",
            url: container[containerType].image,
            size: "xs",
            gravity: "center",
            flex: 1
        }, {
            type: "text",
            text: container[containerType].name,
            size: "md",
            color: "#565656",
            gravity: "center",
            align: "start",
            weight: "bold",
            flex: 4
        }, {
            type: "text",
            text: dateAndStore,
            size: "xs",
            color: "#C0C0C8",
            wrap: true,
            gravity: "bottom",
            align: "end",
            flex: 5
        }]
    };
}