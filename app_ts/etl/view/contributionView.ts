import { separatorTemplate, FlexMessage, spacerTemplate } from '../models/flexMessage';
import { View } from './view';
import { RewardType } from "../../api/enumManager";
class ContrubtionView implements View {
    private separator = separatorTemplate();
    private spacer = spacerTemplate();
    private footerButton_lottery = {
        type: FlexMessage.ComponetType.button,
        action: {
            type: "postback",
            label: "用 5 點好杯幣參加抽獎",
            data: String(RewardType.LOTTERY),
            displayText: "用 5 點好杯幣參加抽獎"
        },
        style: "link",
        color: "#40B9D8"
    };

    private footerButton_redeem = {
        type: FlexMessage.ComponetType.button,
        action: {
            type: "postback",
            label: "用 50 點好杯幣兌換飲料",
            data: String(RewardType.REDEEM),
            displayText: "用 50 點好杯幣兌換飲料"
        },
        style: "link",
        color: "#40B9D8"
    }

    private footer = {
        type: FlexMessage.ComponetType.box,
        layout: FlexMessage.Layout.vertical,
        contents: [this.footerButton_lottery, this.separator.getSeparator(), this.footerButton_redeem]
    };

    private bodyImage = {
        type: FlexMessage.ComponetType.image,
        url: "https://imgur.com/xunv0i4.png",
        size: "full"
    }

    private styles = {
        header: {
            backgroundColor: "#00bbdc"
        },
        footer: {
            separator: true
        }
    };

    private body = {
        type: FlexMessage.ComponetType.box,
        layout: FlexMessage.Layout.vertical,
        spacing: FlexMessage.Spacing.lg,
        contents: Array<any>()
    };

    private hero = {
        type: FlexMessage.ComponetType.image,
        url: "https://imgur.com/xunv0i4.png",
        size: "full",
        aspectMode: "cover"
    }

    private view = {
        type: FlexMessage.Container.bubble,
        hero: this.hero,
        footer: this.footer,
        styles: this.styles
    }
    constructor() {
        this.separator.setMargin(FlexMessage.Margin.none);
        // this.view.body.contents.push(this.bodyImage);
    }
    public pushBodyContent(data) {
        // this.view.body.contents.push(data);
    }

    public pushTimeBar(label: String) {
        // this.view.body.contents.push(addTimeBar(label));
    }

    public pushSeparator() {
        // this.view.body.contents.push(this.separator.getSeparator());
    }

    public pushSpacer() {
        // this.view.body.contents.push(this.spacer.getSpacer());
    }

    public getView() {
        return {
            type: "flex",
            altText: "使用容器數量",
            contents: this.view
        };
    }
};

export { ContrubtionView };