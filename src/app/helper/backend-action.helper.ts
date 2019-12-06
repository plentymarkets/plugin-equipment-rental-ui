export class UiActionHelper
{
    public static callUiAction(uiAction:UiAction):void
    {
        if(window === window.top)
        {
            window.dispatchEvent(new CustomEvent('gwtUiAction', {detail: uiAction}));
        }
        else
        {
            window.parent.dispatchEvent(new CustomEvent('gwtUiAction', {detail: uiAction}));
        }
    }
}

export class UiAction
{
    public uiActionKey:string;
    public params:{};

    constructor(uiActionKey:string, params?:{})
    {
        this.uiActionKey = uiActionKey;
        this.params = params;
    }
}


export enum UiActionEnum
{
    customerDetail = 'CUSTOMER_DETAIL',

    domainNew = 'DOMAIN_NEW',
    domainSearch = 'DOMAIN_SEARCH',

    itemDetail = 'ITEM_DETAIL',
    itemVariationDetail = 'ITEM_VARIATION_DETAIL',
    itemSearch = 'ITEM_SEARCH',

    openAndRunProcess = 'OPEN_AND_RUN_PROCESS',
    orderDetail = 'ORDER_DETAIL',
    orderNew = 'ORDER_NEW',
    orderSchedulerSearch = 'ORDER_SCHEDULER_SEARCH',
    orderSearch = 'ORDER_SEARCH',
    paymentSearch= 'PAYMENT_SEARCH',

    stockReceipt = 'STOCK_RECEIPT',
    systemSearch = 'SYSTEM_SEARCH',

    ticketDetailView = 'TICKET_DETAIL_VIEW',
    ticketNew = 'TICKET_NEW',
    ticketSearch = 'TICKET_SEARCH'
}

export class BackendActionHelper
{

    public static showItemVariation(itemId:number, itemVariationId:number):void
    {
        UiActionHelper.callUiAction(new UiAction(UiActionEnum.itemVariationDetail, {
            itemId: itemId,
            variationId: itemVariationId,
            switchView: true
        }));
    }
}
