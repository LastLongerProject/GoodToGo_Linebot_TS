"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function header() {
    let header = {
        type: "box",
        layout: FlexMessage.Layout.vertical,
        contents: Array()
    };
    function setContents(contents) {
        header.contents = contents;
    }
    function getHeader() {
        return header;
    }
    return {
        getHeader,
        setContents
    };
}
exports.headerTemplate = header;
function separator() {
    let separator = {
        type: "separator",
        margin: FlexMessage.Margin.sm
    };
    function setMargin(margin) {
        separator.margin = margin;
    }
    function getSeparator() {
        return separator;
    }
    return {
        setMargin,
        getSeparator
    };
}
exports.separatorTemplate = separator;
function buttonStyle() {
    return {
        link: "link",
        primary: "primary",
        secondary: "secondary"
    };
}
var FlexMessage;
(function (FlexMessage) {
    let Margin;
    (function (Margin) {
        Margin.none = "none", Margin.xs = "xs", Margin.sm = "sm", Margin.md = "md", Margin.lg = "lg", Margin.xl = "xl", Margin.xxl = "xxl";
    })(Margin = FlexMessage.Margin || (FlexMessage.Margin = {}));
    let Size;
    (function (Size) {
        Size.xxs = "xxs", Size.xs = "xs", Size.sm = "sm", Size.md = "md", Size.lg = "lg", Size.xl = "xl", Size.xxl = "xxl", Size._3xl = "3xl", Size._4xl = "4xl", Size._5xl = "5xl";
    })(Size = FlexMessage.Size || (FlexMessage.Size = {}));
    let Height;
    (function (Height) {
        Height.sm = "sm", Height.md = "md";
    })(Height = FlexMessage.Height || (FlexMessage.Height = {}));
    let Weight;
    (function (Weight) {
        Weight.regular = "regular", Weight.bold = "bold";
    })(Weight = FlexMessage.Weight || (FlexMessage.Weight = {}));
    let Layout;
    (function (Layout) {
        Layout.horizontal = "horizontal", Layout.vertical = "vertical";
    })(Layout = FlexMessage.Layout || (FlexMessage.Layout = {}));
    let Gravity;
    (function (Gravity) {
        Gravity.top = "top", Gravity.bottom = "bottom", Gravity.center = "center";
    })(Gravity = FlexMessage.Gravity || (FlexMessage.Gravity = {}));
    let ComponetType;
    (function (ComponetType) {
        ComponetType.box = "box", ComponetType.button = "button", ComponetType.filler = "filler", ComponetType.icon = "icon", ComponetType.image = "image", ComponetType.separator = "separator", ComponetType.spacer = "spacer", ComponetType.text = "text";
    })(ComponetType = FlexMessage.ComponetType || (FlexMessage.ComponetType = {}));
    let Align;
    (function (Align) {
        Align.start = "start", Align.end = "end", Align.center = "center";
    })(Align = FlexMessage.Align || (FlexMessage.Align = {}));
    let Spacing;
    (function (Spacing) {
        Spacing.none = "none", Spacing.xs = "xs", Spacing.sm = "sm", Spacing.md = "md", Spacing.lg = "lg", Spacing.xl = "xl", Spacing.xxl = "xxl";
    })(Spacing = FlexMessage.Spacing || (FlexMessage.Spacing = {}));
    let Container;
    (function (Container) {
        Container.bubble = "bubble", Container.carousel = "carousel";
    })(Container = FlexMessage.Container || (FlexMessage.Container = {}));
})(FlexMessage || (FlexMessage = {}));
exports.FlexMessage = FlexMessage;
//# sourceMappingURL=flexMessage.js.map