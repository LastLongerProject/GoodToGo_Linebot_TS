import { FlexMessage, addTimeBar } from "../models/flexMessage";
import { container } from "../models/container";
import { DataType } from "../../lib/enumManager";

export class ContainerStateView {
    protected name: string;
    protected amount: string;
    protected separator = {
        type: "separator",
        margin: FlexMessage.Margin.none
    }

    protected spacer = {
        type: "spacer",
        size: FlexMessage.Size.sm
    }

    protected inusedAmount = {
        type: FlexMessage.ComponetType.text,
        text: "",
        size: FlexMessage.Size.xl,
        weight: FlexMessage.Weight.bold,
        align: FlexMessage.Align.end,
        gravity: FlexMessage.Gravity.center,
        color: "#ffe552"
    };
    protected headerText = {
        type: FlexMessage.ComponetType.text,
        text: "",
        size: FlexMessage.Size.xl,
        weight: FlexMessage.Weight.bold,
        gravity: FlexMessage.Gravity.center,
        color: "#ffffff"
    };

    protected header = {
        type: "box",
        layout: FlexMessage.Layout.horizontal,
        contents: [this.headerText]
    }

    protected bodyContent(containerType: string, containerId: string, info_1: string, info_2: string): any {
        let bodyContent = {
            type: FlexMessage.ComponetType.box,
            layout: FlexMessage.Layout.horizontal,
            contents: [{
                type: FlexMessage.ComponetType.image,
                url: container[containerType].imageUrl,
                size: FlexMessage.Size.xl,
                gravity: FlexMessage.Gravity.center,
                flex: 1
            },
            {
                type: FlexMessage.ComponetType.box,
                layout: FlexMessage.Layout.vertical,
                margin: FlexMessage.Margin.xxl,
                flex: 4,
                contents: [
                    this.spacer
                    , {
                        type: FlexMessage.ComponetType.text,
                        text: container[containerType].name,
                        size: FlexMessage.Size.md,
                        color: "#565656",
                        align: FlexMessage.Align.start,
                        weight: FlexMessage.Weight.bold
                    }, {
                        type: FlexMessage.ComponetType.text,
                        text: containerId,
                        size: FlexMessage.Size.xxs,
                        color: "#484848",
                        margin: FlexMessage.Margin.xs,
                        align: FlexMessage.Align.start
                    }]
            }, {
                type: FlexMessage.ComponetType.box,
                layout: FlexMessage.Layout.vertical,
                margin: FlexMessage.Margin.none,
                flex: 5,
                contents: [{
                    type: FlexMessage.ComponetType.text,
                    text: info_1,
                    size: FlexMessage.Size.xxs,
                    color: "#C0C0C8",
                    gravity: FlexMessage.Gravity.bottom,
                    align: FlexMessage.Align.end
                }, {
                    type: FlexMessage.ComponetType.text,
                    text: info_2,
                    size: FlexMessage.Size.xxs,
                    color: "#C0C0C8",
                    align: FlexMessage.Align.end,
                    wrap: true
                }]
            }]
        }
        return bodyContent
    }

    protected footerButton_getMore = {
        type: FlexMessage.ComponetType.button,
        action: {
            type: "postback",
            label: "查看",
            data: "",
            displayText: "查看"
        },
        style: "link",
        color: "#8FD5E8"
    };

    protected footerButton_getAnother = {
        type: FlexMessage.ComponetType.button,
        action: {
            type: "postback",
            label: "查看",
            data: "",
            displayText: "查看"
        },
        style: "link",
        color: "#8FD5E8"
    }

    protected footer = {
        type: FlexMessage.ComponetType.box,
        layout: FlexMessage.Layout.vertical,
        contents: [this.footerButton_getMore, this.separator, this.footerButton_getAnother]
    };

    protected styles = {
        header: {
            backgroundColor: "#00bbdc"
        },
        footer: {
            separator: true
        }
    };

    protected body = {
        type: FlexMessage.ComponetType.box,
        layout: FlexMessage.Layout.vertical,
        spacing: FlexMessage.Spacing.lg,
        contents: Array<any>()
    };

    protected view = {
        type: FlexMessage.Container.bubble,
        header: this.header,
        body: this.body,
        footer: this.footer,
        styles: this.styles
    }

    constructor(name: string, amount: string) {
        this.name = name;
        this.amount = amount;
        this.viewInit();
    }

    private viewInit() {
        this.headerText.text = this.name;
        this.inusedAmount.text = this.amount;
        this.header.contents.push(this.inusedAmount);
    }

    protected setFootButton(getMore: DataType, getAnother: DataType) {
        let label_getAnother = getAnother === DataType.IN_USED ? "使用中容器" : "已歸還容器";
        this.footerButton_getAnother.action.label += label_getAnother;
        this.footerButton_getAnother.action.displayText += label_getAnother;
        this.footerButton_getAnother.action.data = getAnother;
        this.footerButton_getMore.action.data = getMore;
    }

    public pushBodyContent(containerType: any, containerId: string, date: string, store: string) {
        this.view.body.contents.push(this.bodyContent(containerType, containerId, date, store));
    }

    public pushTimeBar(label: String) {
        this.view.body.contents.push(addTimeBar(label));
    }

    public pushSeparator(margin: string) {
        let separator = {
            type: "separator",
            margin: margin
        }
        this.view.body.contents.push(separator);
    }

    public addIndexToFooterButtonLabel(index: string) {
        this.footerButton_getMore.action.label += index;
    }

    public deleteGetmoreButton() {
        this.footer.contents.splice(1, 1);
    }

    public getView() {
        return {
            type: "flex",
            altText: this.name,
            contents: this.view
        };
    }
}

