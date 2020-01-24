export interface UserRightsInterface{
    id?:number;
    user?:string;
    real_name?:string;
    Ustatus?:string;
    userId?:number;
    emailHash?:string;
    daysLeftToChangePassword?:null|number;
    isSupportUser?:boolean;
}
