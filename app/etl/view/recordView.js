"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../models/container");
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
    contents: Array()
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
    contents: [footerButton]
};
let styles = {
    header: {
        backgroundColor: "#00bbdc"
    },
    footer: {
        separator: true
    }
};
function recordView() {
    let view = {
        type: "bubble",
        header: header,
        body: body,
        footer: footer,
        styles: styles
    };
    function pushBodyContent(containerType, dateAndStore) {
        view.body.contents.push(getBodyContent(containerType, dateAndStore));
    }
    function pushTimeBar(label) {
        view.body.contents.push(addTimeBar(label));
    }
    function getView() {
        return view;
    }
    return {
        pushBodyContent: pushBodyContent,
        pushTimeBar: pushTimeBar,
        getView: getView
    };
}
exports.recordView = recordView;
;
function getBodyContent(containerType, dateAndStore) {
    console.log(containerType);
    return {
        type: "box",
        layout: "horizontal",
        contents: [{
                type: "image",
                url: container_1.container[String(containerType)].image,
                size: "xs",
                gravity: "center",
                flex: 1
            }, {
                type: "text",
                text: container_1.container[String(containerType)].name,
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
function addTimeBar(date) {
    return {
        type: "text",
        text: "date",
        size: "md",
        weight: "bold",
        color: "#04B7E6"
    };
}
//# sourceMappingURL=recordView.js.map