"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flexMessage_1 = require("../models/flexMessage");
const inusedView_1 = require("./inusedView");
class RecordView extends inusedView_1.InusedView {
    constructor() {
        super(...arguments);
        this.name = "已歸還容器";
        this.post_getMore = "get more record from database" /* GET_MORE_RECORD */;
        this.post_getAnother = "get more in used container from database" /* GET_MORE_INUSED */;
    }
    pushBodyContent(containerType, containerId, dateAndStore) {
        this.view.body.contents.push(flexMessage_1.getBodyContent(containerType, dateAndStore));
    }
    pushTimeBar(label) {
        this.view.body.contents.push(flexMessage_1.addTimeBar(label));
    }
    pushSeparator(margin) {
        this.separator.setMargin(margin);
        this.view.body.contents.push(this.separator.getSeparator());
    }
    addIndexToFooterButtonLabel(index) { }
    deleteGetmoreButton() {
        this.footer.contents.slice(1, 1);
    }
    getView() {
        return {
            type: "flex",
            altText: "已歸還容器",
            contents: this.view
        };
    }
}
exports.RecordView = RecordView;
;
//# sourceMappingURL=recordView.js.map