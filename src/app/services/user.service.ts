import { Injectable } from '@angular/core';
import {
    TerraDataTableBaseService,
    TerraPagerParameterInterface,
    TerraPagerInterface,
    TerraDataTableCellInterface,
    TerraDataTableRowInterface

} from '@plentymarkets/terra-components';

import {Observable, of} from 'rxjs';
import {UserRightsInterface} from "../interfaces/userrights.interface";
import {Router} from "@angular/router";
import {RouterViewComponent} from "../views/router/router-view.component";

export enum TerraDataTableSortOrderEnum
{
    descending = 'desc',
    ascending = 'asc'
}
function isNullOrUndefined(object: any):boolean { return object === undefined || object === null};

@Injectable()
export class UserTableService extends TerraDataTableBaseService<UserRightsInterface, TerraPagerParameterInterface>
{
    private data:Array<UserRightsInterface> = [];


    constructor(private router: Router,
                private routerViewComponent:RouterViewComponent)
    {
        super();
        this.defaultPagingSize = 25; // set default items per page

        this.pagingSizes = [ // set values for "items per page" dropdown
            {
                value:   25,
                caption: '25'
            },
            {
                value:   50,
                caption: '50'
            },
            {
                value:   75,
                caption: '75'
            },
            {
                value:   100,
                caption: '100'
            }
        ];
    }

    // This method usually just requests data from the server via REST using another service, which has to be injected in the constructor
    public requestTableData(params?:TerraPagerParameterInterface):Observable<TerraPagerInterface<UserRightsInterface>>
    {
        // build up paging information
        let firstOnPage:number = Math.max((params.page - 1) * params.itemsPerPage, 0);
        let lastOnPage:number = Math.min(params.page * params.itemsPerPage, this.data.length);
        let lastPageNumber:number = Math.ceil(this.data.length / params.itemsPerPage);

        let results:TerraPagerInterface<UserRightsInterface> = {
            page:           params.page,
            itemsPerPage:   params.itemsPerPage,
            totalsCount:    this.data.length,
            isLastPage:     params.page === lastPageNumber,
            lastPageNumber: lastPageNumber,
            firstOnPage:    firstOnPage + 1,
            lastOnPage:     lastOnPage,
        };


        // set default params if not given
        if(isNullOrUndefined(params))
        {
            params = {};
        }
        if(isNullOrUndefined(params['sortBy']))
        {
            params['sortBy'] = 'created_at'; //default field to sort by
        }
        if(isNullOrUndefined(params['sortOrder']))
        {
            params['sortOrder'] = TerraDataTableSortOrderEnum.descending;
        }

        // apply sorting
        let entries:Array<UserRightsInterface> = this.applySorting(this.data, params['sortBy'], params['sortOrder']);

        // cut data that is not included in the requested page
        results.entries = entries.slice(firstOnPage, lastOnPage);

        // return data
        return of(results);
    }

    private applySorting(data:Array<UserRightsInterface>, sortBy:string,
                         sortOrder:TerraDataTableSortOrderEnum):Array<UserRightsInterface>
    {
        let comparator:(a:UserRightsInterface, b:UserRightsInterface) => number;
        if(sortOrder === TerraDataTableSortOrderEnum.ascending)
        {
            comparator = (a:UserRightsInterface, b:UserRightsInterface):number => a[sortBy] - b[sortBy];
        }
        else
        {
            comparator = (a:UserRightsInterface, b:UserRightsInterface):number => b[sortBy] - a[sortBy];
        }
        return data.sort(comparator);
    }

    // push history data to array
    public addEntry(history:UserRightsInterface):void
    {
        this.data.push(history);
    }


    // clear history data
    public clearEntrys():void
    {
        this.data = [];
    }

    public getEntryCount():number
    {
        return this.data.length;
    }

    public dataToRowMapping(entry:UserRightsInterface):TerraDataTableRowInterface<UserRightsInterface>
    {
        let cellList:Array<TerraDataTableCellInterface> = [
            {
                data: entry.id
            },
            {
                data: entry.real_name
            },
            {
                data: entry.user
            },
            {
                data: entry.Ustatus
            }
        ];

        return {
            cellList:      cellList,
            data:          entry,
            clickFunction:       ():void => this.rowClicked(entry)
        };
    }

    /**
     * On click row navigate to the specific user
     */
    private rowClicked(entry:UserRightsInterface):void
    {
        console.log(entry);
        this.router.navigateByUrl('plugin/rights/'+entry.id);
        setTimeout(() =>
            {
                this.routerViewComponent.breadcrumbsService.updateBreadcrumbNameByUrl('/rights/'+entry.id, entry.real_name);
            },
            100);
    }
}
