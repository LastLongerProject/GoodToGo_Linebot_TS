import { separatorTemplate, FlexMessage } from '../models/flexMessage';
class ContrubtionView {
    private separator = separatorTemplate();

    private image = {
        water: "https://imgur.com/c5Fs3UE.png",
        tree: "https://imgur.com/WoW1JPY.png",
        co2: "https://imgur.com/CX2OOg0.png"
    }
    private headerText = [{
        type: FlexMessage.ComponetType.text,
        text: "您已減少",
        size: FlexMessage.Size.xl,
        weight: FlexMessage.Weight.bold,
        align: FlexMessage.Align.end,
        flex: 4,
        color: "#ffffff"
    }, {
        type: FlexMessage.ComponetType.text,
        text: "82",
        size: FlexMessage.Size.xl,
        weight: FlexMessage.Weight.bold,
        align: FlexMessage.Align.center,
        flex: 2,
        color: "#ffe552"
    }, {
        type: FlexMessage.ComponetType.text,
        text: "件垃圾",
        size: FlexMessage.Size.xl,
        weight: FlexMessage.Weight.bold,
        align: FlexMessage.Align.start,
        flex: 5,
        color: "#ffffff"
    }];

    private header = {
        type: "box",
        layout: FlexMessage.Layout.horizontal,
        contents: this.headerText
    }
    private styles = {
        header: {
            backgroundColor: "#00bbdc"
        }
    };

    private bodyCell(url: string, type: string, amount: string) {
        let image = {
            type: FlexMessage.ComponetType.image,
            url: url,
            size: FlexMessage.Size.xxs,
            align: FlexMessage.Align.start,
            gravity: FlexMessage.Gravity.center,
            flex: 1
        }

        let savingType = {
            type: FlexMessage.ComponetType.text,
            text: type,
            size: FlexMessage.Size.xs,
            color: "#484848",
            gravity: FlexMessage.Gravity.top,
            align: FlexMessage.Align.end,
            flex: 5
        }

        let savingAmount = {
            type: FlexMessage.ComponetType.text,
            text: amount,
            size: FlexMessage.Size.lg,
            color: "#484848",
            gravity: FlexMessage.Gravity.bottom,
            align: FlexMessage.Align.end,
            flex: 5
        }

        let text = {
            type: FlexMessage.ComponetType.box,
            layout: FlexMessage.Layout.vertical,
            contents: [savingType, savingAmount]
        }

        let cell = {
            type: FlexMessage.ComponetType.box,
            layout: FlexMessage.Layout.horizontal,
            contents: [
                image,
                text
            ]
        }

        return cell

    }

    private bodyContent = [
        {
            type: FlexMessage.ComponetType.text,
            text: "累計節省了",
            color: "#484848"
        },
        this.separator.getSeparator(),
        this.bodyCell(this.image.tree, "樹木", "0.038 棵"),
        this.separator.getSeparator(),
        this.bodyCell(this.image.water, "水", "73.8 公升"),
        this.separator.getSeparator(),
        this.bodyCell(this.image.co2, "碳排放", "8.2 公斤"),
        this.separator.getSeparator(),
        {
            type: FlexMessage.ComponetType.text,
            text: "謝謝您讓地球更美麗！：）",
            color: "#484848"
        }
    ];

    private body = {
        type: FlexMessage.ComponetType.box,
        layout: FlexMessage.Layout.vertical,
        spacing: FlexMessage.Spacing.xl,
        contents: this.bodyContent
    };

    private view = {
        type: FlexMessage.Container.bubble,
        header: this.header,
        body: this.body,
        styles: this.styles
    }
    constructor() {
        this.separator.setMargin(FlexMessage.Margin.lg);
    }

    public getView() {
        return {
            type: "flex",
            altText: "我的貢獻",
            contents: this.view
        };
    }
};

export { ContrubtionView };