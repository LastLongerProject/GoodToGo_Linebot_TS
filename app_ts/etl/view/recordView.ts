import { View } from "./view"
import { headerTemplate, separatorTemplate, FlexMessage, addTimeBar, getBodyContent } from "../models/flexMessage"
import { DataType } from '../../lib/enumManager';
import { InusedView } from "./inusedView";
class RecordView extends InusedView {
    name = "已歸還容器";
    post_getMore = DataType.GET_MORE_RECORD;
    post_getAnother = DataType.GET_MORE_INUSED;
    public pushBodyContent(containerType: any, containerId: string, dateAndStore: String) {
        this.view.body.contents.push(getBodyContent(containerType, dateAndStore));
    }

    public pushTimeBar(label: String) {
        this.view.body.contents.push(addTimeBar(label));
    }

    public pushSeparator(margin: string) {
        this.separator.setMargin(margin);
        this.view.body.contents.push(this.separator.getSeparator());
    }
    public addIndexToFooterButtonLabel(index: string) { }

    public deleteGetmoreButton() {
        this.footer.contents.slice(1, 1);
    }

    public getView() {
        return {
            type: "flex",
            altText: "已歸還容器",
            contents: this.view
        };
    }
};

export { RecordView };
