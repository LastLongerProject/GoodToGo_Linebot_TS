import { ContainerStateView } from "./containerView"
import { DataType } from '../../lib/enumManager';
import { FlexMessage } from "../models/flexMessage";
class RecordView extends ContainerStateView {
    constructor(amount: string) {
        super("已歸還容器", amount);
        this.setFootButton(DataType.GET_MORE_RECORD, DataType.IN_USED);
    }
};

export { RecordView };
