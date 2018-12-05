export interface View {
    pushBodyContent(containerType: any, containerId: string, info_1: string, info_2: string);
    pushTimeBar(label: String);
    pushSeparator(margin: string);
    getView();
    addIndexToFooterButtonLabel(index: string);
    deleteGetmoreButton();
}

