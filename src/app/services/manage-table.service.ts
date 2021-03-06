import { Injectable } from '@angular/core';
import {
    TerraDataTableBaseService,
    TerraPagerParameterInterface,
    TerraPagerInterface,
    TerraDataTableCellInterface,
    TerraDataTableRowInterface

} from '@plentymarkets/terra-components';

import {Observable, of} from 'rxjs';
import { HistoryDataTableInterface } from '../interfaces/history-data-table.interface';

export enum TerraDataTableSortOrderEnum
{
    descending = 'desc',
    ascending = 'asc'
}
function isNullOrUndefined(object: any):boolean { return object === undefined || object === null};

@Injectable()
export class ManageDataTableService extends TerraDataTableBaseService<HistoryDataTableInterface, TerraPagerParameterInterface>
{
    private data:Array<HistoryDataTableInterface> = [];


    constructor()
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
    public requestTableData(params?:TerraPagerParameterInterface):Observable<TerraPagerInterface<HistoryDataTableInterface>>
    {
        // build up paging information
        let firstOnPage:number = Math.max((params.page - 1) * params.itemsPerPage, 0);
        let lastOnPage:number = Math.min(params.page * params.itemsPerPage, this.data.length);
        let lastPageNumber:number = Math.ceil(this.data.length / params.itemsPerPage);

        let results:TerraPagerInterface<HistoryDataTableInterface> = {
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
        let entries:Array<HistoryDataTableInterface> = this.applySorting(this.data, params['sortBy'], params['sortOrder']);

        // cut data that is not included in the requested page
        results.entries = entries.slice(firstOnPage, lastOnPage);

        // return data
        return of(results);
    }

    private applySorting(data:Array<HistoryDataTableInterface>, sortBy:string,
                         sortOrder:TerraDataTableSortOrderEnum):Array<HistoryDataTableInterface>
    {
        let comparator:(a:HistoryDataTableInterface, b:HistoryDataTableInterface) => number;
        if(sortOrder === TerraDataTableSortOrderEnum.ascending)
        {
            comparator = (a:HistoryDataTableInterface, b:HistoryDataTableInterface):number => a[sortBy] - b[sortBy];
        }
        else
        {
            comparator = (a:HistoryDataTableInterface, b:HistoryDataTableInterface):number => b[sortBy] - a[sortBy];
        }
        return data.sort(comparator);
    }

    // push history data to array
    public addEntry(history:HistoryDataTableInterface):void
    {
        this.data.push(history);
    }


    // clear history data
    public clearEntrys():void
    {
        this.data = [];
    }

    public removeEntryByDeviceId(deviceId:number):void
    {
        let updatedArray = [];
        for (let device of this.data) {
            if (device.deviceId !== deviceId) {
                updatedArray.push(device);
            }
        }
        this.data = updatedArray;
    }

    public dataToRowMapping(entry:HistoryDataTableInterface):TerraDataTableRowInterface<HistoryDataTableInterface>
    {
        let cellList:Array<TerraDataTableCellInterface> = [
            {
                data: entry.name
            },
            {
                data: entry.user
            },
            {
                data: entry.comment
            },
            {
                data: entry.rent_until
            },
            {
                data: entry.created_at
            },
            {
                data: entry.deviceId
            }
        ];

        return {
            cellList:      cellList,
            data:          entry
        };
    }
}
