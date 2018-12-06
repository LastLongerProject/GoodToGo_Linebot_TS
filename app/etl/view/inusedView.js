"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const containerView_1 = require("./containerView");
class InusedView extends containerView_1.ContainerStateView {
    constructor(amount) {
        super("使用中容器", amount);
        this.setFootButton("get more in used container from database" /* GET_MORE_INUSED */, "record" /* RECORD */);
    }
    pushBodyContent(containerType, containerId, date, store) {
        let bodyContent = this.bodyContent(containerType, containerId, date, store);
        bodyContent.contents[2].contents.unshift(this.spacer);
        this.view.body.contents.push(bodyContent);
    }
}
exports.InusedView = InusedView;
;
//# sourceMappingURL=inusedView.js.map