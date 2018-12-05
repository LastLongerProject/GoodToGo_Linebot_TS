import { headerTemplate, separatorTemplate, FlexMessage, addTimeBar, spacerTemplate } from '../models/flexMessage';
import { View } from './view';
import { DataType } from '../../lib/enumManager';
import { container } from "../models/container";
class InusedView implements View {
    protected inusedAmount: any;
    protected name = "使用中容器";
    protected post_getMore = DataType.GET_MORE_INUSED;
    protected post_getAnother = DataType.RECORD;

    protected separator = {
        type: "separator",
        margin: FlexMessage.Margin.none
    }
    protected headerText = {
        type: FlexMessage.ComponetType.text,
        text: name,
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

    protected bodyContent(containerType: string, containerId: string, info_1: string, info_2: string) {
        return {
            type: FlexMessage.ComponetType.box,
            layout: FlexMessage.Layout.horizontal,
            contents: [{
                type: FlexMessage.ComponetType.image,
                url: container[containerType].imageUrl,
                size: FlexMessage.Size.xl,
                gravity: FlexMessage.Gravity.center,
                flex: 2
            },
            {
                type: FlexMessage.ComponetType.box,
                layout: FlexMessage.Layout.vertical,
                margin: FlexMessage.Margin.lg,
                flex: 8,
                contents: [{
                    type: FlexMessage.ComponetType.text,
                    text: container[containerType].name,
                    size: FlexMessage.Size.md,
                    color: "#565656",
                    gravity: FlexMessage.Gravity.center,
                    align: FlexMessage.Align.start,
                    weight: FlexMessage.Weight.bold
                }, {
                    type: FlexMessage.ComponetType.text,
                    text: containerId,
                    size: FlexMessage.Size.xxs,
                    color: "#484848",
                    margin: FlexMessage.Margin.xs,
                    gravity: FlexMessage.Gravity.center,
                    align: FlexMessage.Align.start
                }]
            }, {
                type: FlexMessage.ComponetType.box,
                layout: FlexMessage.Layout.vertical,
                margin: FlexMessage.Margin.none,
                flex: 10,
                contents: [{
                    type: FlexMessage.ComponetType.text,
                    text: info_1,
                    size: FlexMessage.Size.xxs,
                    color: "#C0C0C8",
                    align: FlexMessage.Align.end,
                }, {
                    type: FlexMessage.ComponetType.text,
                    text: info_2,
                    size: FlexMessage.Size.xxs,
                    color: "#C0C0C8",
                    gravity: FlexMessage.Gravity.bottom,
                    margin: FlexMessage.Margin.md,
                    align: FlexMessage.Align.end,
                }]
            }]
        }
    }

    protected body = {
        type: FlexMessage.ComponetType.box,
        layout: FlexMessage.Layout.vertical,
        spacing: FlexMessage.Spacing.lg,
        contents: Array<any>()
    };

    protected footerButton_getMore = {
        type: FlexMessage.ComponetType.button,
        action: {
            type: "postback",
            label: "顯示更多",
            data: this.post_getMore,
            displayText: "顯示更多"
        },
        style: "link",
        color: "#8FD5E8"
    };

    protected footerButton_getAnother = {
        type: FlexMessage.ComponetType.button,
        action: {
            type: "postback",
            label: "查看已歸還容器",
            data: this.post_getAnother,
            displayText: "查看已歸還容器"
        },
        style: "link",
        color: "#8FD5E8"
    }

    protected footer = {
        type: FlexMessage.ComponetType.box,
        layout: FlexMessage.Layout.vertical,
        contents: [this.separator, this.footerButton_getMore, this.separator, this.footerButton_getAnother]
    };

    protected styles = {
        header: {
            backgroundColor: "#00bbdc"
        }
    };

    protected view = {
        type: FlexMessage.Container.bubble,
        header: this.header,
        body: this.body,
        footer: this.footer,
        styles: this.styles
    }

    constructor(amount: string) {
        this.inusedAmount = {
            type: FlexMessage.ComponetType.text,
            text: amount,
            size: FlexMessage.Size.xl,
            weight: FlexMessage.Weight.bold,
            align: FlexMessage.Align.end,
            gravity: FlexMessage.Gravity.center,
            color: "#ffe552"
        }

        this.header.contents.push(this.inusedAmount);
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
            altText: "使用中容器",
            contents: this.view
        };
    }
};

export { InusedView };

