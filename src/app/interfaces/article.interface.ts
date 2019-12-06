export interface ArticleInterface
{
    id?:number;
    itemId?:number;
    name?:string;
    image?:string;
    attributes?:Object;
    properties?:any;
    created_at?:string;
    category?:number;
    available?:number;
    user?:string;
    rent_until?:number;
    status?:number;
}
