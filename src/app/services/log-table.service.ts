import {Injectable, ViewChild} from '@angular/core';
import {
    TerraDataTableBaseService,
    TerraPagerParameterInterface,
    TerraPagerInterface,
    TerraDataTableCellInterface,
    TerraDataTableRowInterface

} from '@plentymarkets/terra-components';
import {Observable,of} from 'rxjs';

import {OverviewDataService} from "./overview-view.service";
import {LogDataTableInterface} from "../interfaces/log-data-table.interface";
import {MatSelect} from "@angular/material/select";

export enum TerraDataTableSortOrderEnum
{
    descending = 'desc',
    ascending = 'asc'
}
function isNullOrUndefined(object: any):boolean { return object === undefined || object === null};

@Injectable()
export class LogDataTableService extends TerraDataTableBaseService<LogDataTableInterface, TerraPagerParameterInterface>
{
    private data:Array<LogDataTableInterface> = [];
    public filterDevice: number;
    public filterUser: number;

    constructor(private statsDataService:OverviewDataService)
    {
        super();
        this.defaultPagingSize = 5; // set default items per page

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
    public requestTableData(params?:any):Observable<any>
    {
        console.log(this.filterDevice);
        if(!isNullOrUndefined(this.filterDevice) && this.filterDevice > 0){
            params['device'] = this.filterDevice;
        }
        if(!isNullOrUndefined(this.filterUser) && this.filterUser > 0){
            params['user'] = this.filterUser;
        }
        console.table(params);
        return this.statsDataService.getLogEntries(params);
    }

    private applySorting(data:Array<LogDataTableInterface>, sortBy:string,
                         sortOrder:TerraDataTableSortOrderEnum):Array<LogDataTableInterface>
    {
        let comparator:(a:LogDataTableInterface, b:LogDataTableInterface) => number;
        if(sortOrder === TerraDataTableSortOrderEnum.ascending)
        {
            comparator = (a:LogDataTableInterface, b:LogDataTableInterface):number => a[sortBy] - b[sortBy];
        }
        else
        {
            comparator = (a:LogDataTableInterface, b:LogDataTableInterface):number => b[sortBy] - a[sortBy];
        }
        return data.sort(comparator);
    }

    // push history data to array
    public addEntry(history:LogDataTableInterface):void
    {
        this.data.push(history);
    }


    // clear history data
    public clearEntrys():void
    {
        this.data = [];
    }

    public capitalize(string:string):string
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    public dataToRowMapping(entry:LogDataTableInterface):TerraDataTableRowInterface<LogDataTableInterface>
    {
        let dateOptions:Object = { year: 'numeric', month: '2-digit', day: '2-digit' };
        entry.created_at = new Date(parseInt(entry.created_at) * 1000).toLocaleDateString('de-DE', dateOptions);
        let cellList:Array<TerraDataTableCellInterface> = [
            {
                data: entry.userId
            },
            {
                data: entry.rentalItem
            },
            {
                data: entry.message
            },
            {
                data: entry.created_at
            },
        ];

        return {
            cellList:      cellList,
            data:          entry
        };
    }
}
