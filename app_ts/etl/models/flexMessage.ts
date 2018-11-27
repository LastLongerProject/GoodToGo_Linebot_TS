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
    FlexMessage
}