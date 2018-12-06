"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const containerView_1 = require("./containerView");
class RecordView extends containerView_1.ContainerStateView {
    constructor(amount) {
        super("已歸還容器", amount);
        this.setFootButton("get more record from database" /* GET_MORE_RECORD */, "in used" /* IN_USED */);
    }
}
exports.RecordView = RecordView;
;
//# sourceMappingURL=recordView.js.map