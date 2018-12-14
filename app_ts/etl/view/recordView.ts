import { ContainerStateView } from "./containerView"
import { DataType } from '../../lib/enumManager';
class RecordView extends ContainerStateView {
    constructor(amount: string) {
        super("已歸還容器", amount);
        this.setFootButton(DataType.GET_MORE_RECORD, DataType.IN_USED);
    }
};

export { RecordView };
