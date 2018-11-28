import { container } from "../models/container"

function header(): any {
    let header = {
        type: "box",
        layout: FlexMessage.Layout.vertical,
        contents: Array<any>()
    }

    function setContents(contents: Array<any>) {
        header.contents = contents;
    }

    function getHeader() {
        return header
    }

    return {
        getHeader,
        setContents
    };
}

function separator(): any {
    let separator = {
        type: "separator",
        margin: FlexMessage.Margin.sm
    }

    function setMargin(margin: string) {
        separator.margin = margin
    }

    function getSeparator() {
        return separator;
    }

    return {
        setMargin,
        getSeparator
    }
}

function spacer(): any {
    let spacer = {
        type: "spacer",
        size: FlexMessage.Size.md
    }

    function setSize(size: string) {
        spacer.size = size
    }

    function getSpacer() {
        return spacer;
    }

    return {
        setSize,
        getSpacer
    }
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

function buttonStyle(): any {
    return {
        link: "link",
        primary: "primary",
        secondary: "secondary"
    }
}

namespace FlexMessage {
    export namespace Margin {
        export const none = "none",
        xs = "xs",
        sm = "sm",
        md = "md",
        lg = "lg",
        xl = "xl",
        xxl = "xxl"
    }
    
    export namespace Size {
        export const xxs = "xxs",
        xs = "xs",
        sm = "sm",
        md = "md",
        lg = "lg",
        xl = "xl",
        xxl = "xxl",
        _3xl = "3xl",
        _4xl = "4xl",
        _5xl = "5xl"
    }
    
    export namespace Height {
        export const sm = "sm",
        md = "md"
    }
    
    export namespace Weight {
        export const regular = "regular",
        bold = "bold"
    }
    
    export namespace Layout {
        export const horizontal = "horizontal",
        vertical = "vertical"
    }
    
    export namespace Gravity {
        export const top = "top",
        bottom = "bottom",
        center = "center"
    }
    
    export namespace ComponetType {
        export const box = "box",
        button = "button",
        filler = "filler",
        icon = "icon",
        image = "image",
        separator = "separator",
        spacer = "spacer",
        text = "text"
    }
    
    export namespace Align {
        export const start = "start",
        end = "end",
        center = "center"
    }

    export namespace Spacing {
        export const none = "none",
        xs = "xs",
        sm = "sm",
        md = "md",
        lg = "lg",
        xl = "xl",
        xxl = "xxl"
    }

    export namespace Container {
        export const bubble = "bubble",
        carousel = "carousel"
    }
}

export {
    header as headerTemplate,
    separator as separatorTemplate,
    spacer as spacerTemplate,
    FlexMessage,
    addTimeBar,
    getBodyContent
}