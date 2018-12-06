import { ContainerStateView } from './containerView';
import { DataType } from '../../lib/enumManager';
class InusedView extends ContainerStateView {
    constructor(amount: string) {
        super("使用中容器", amount);
        this.setFootButton(DataType.GET_MORE_INUSED, DataType.RECORD);
    }

    public pushBodyContent(containerType: any, containerId: string, date: string, store: string) {
        let bodyContent = this.bodyContent(containerType, containerId, date, store);
        bodyContent.contents[2].contents.unshift(this.spacer);
        this.view.body.contents.push(bodyContent);
    }
};

export { InusedView };

