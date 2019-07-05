import {
    Component,
    ViewChild
} from '@angular/core';
import { ManageDataTableService } from '../overview/table/manage-table.service';
import {
    TerraDataTableHeaderCellInterface,
    TerraTextAlignEnum,
    TerraDataTableRowInterface,
    TerraOverlayComponent,
    TerraCheckboxComponent,
    AlertService
} from '@plentymarkets/terra-components';
import { HistoryDataTableInterface } from '../overview/table/history-data-table.interface';
import { OverviewDataService } from '../overview/overview-view.service';

@Component({
    selector: 'manage-view',
    template: require('./manage-view.component.html'),
    providers: [ManageDataTableService]
})
export class ManageViewComponent
{
    public isLoading:boolean;

    @ViewChild('manageOverlay')
    public manageOverlay:TerraOverlayComponent;

    @ViewChild('sendMailOption')
    public sendMailOption;

    @ViewChild('giveBackOption')
    public giveBackOption;

    protected readonly headerList:Array<TerraDataTableHeaderCellInterface>;

    constructor(
        private _statsDataService:OverviewDataService,
        private _manageService:ManageDataTableService,
        private _alert:AlertService
    )
    {
        this.headerList = this.createHeaderList();
    }

    public ngOnInit():void
    {
        this.loadHistoryData();
    }

    private createHeaderList():Array<TerraDataTableHeaderCellInterface>
    {
        return [
            {
                caption: 'Name',
                sortBy:  'name',
                width:   10,
                textAlign: TerraTextAlignEnum.LEFT
            },
            {
                caption: 'Verliehen an',
                sortBy:  'user',
                width:   10,
                textAlign: TerraTextAlignEnum.LEFT
            },
            {
                caption:   'Kommentar',
                sortBy:    'comment',
                width:     10,
                textAlign: TerraTextAlignEnum.LEFT
            },
            {
                caption:   'Verliehen am',
                sortBy:    'created_at',
                width:     10,
                textAlign: TerraTextAlignEnum.LEFT
            },
            {
                caption:   'Tage verbleibend',
                sortBy:    'rent_until',
                width:     10,
                textAlign: TerraTextAlignEnum.LEFT
            }
        ];
    }

    public loadHistoryData():void
    {
        this.isLoading = true;
        let dateOptions:any = { year: 'numeric', month: '2-digit', day: '2-digit' };

        this._manageService.clearEntrys();

        this._statsDataService.getRestCallData('plugin/equipmentRental/rentalDevice/getRentedDevices').subscribe((response:Array<any>) =>
            {
                for(let deviceHistory of response)
                {
                    let diffTime:number = deviceHistory.rent_until * 1000 - new Date().getTime();
                    let diffDays:number = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    let historyItem:HistoryDataTableInterface = {
                        name: deviceHistory.name,
                        user: deviceHistory.user,
                        adminUser: deviceHistory.adminUser,
                        comment: deviceHistory.comment,
                        getBackComment: deviceHistory.getBackComment,
                        isAvailable: deviceHistory.isAvailable,
                        rent_until: deviceHistory.rent_until > 0 ?  diffDays : 'Unbestimmte Zeit',
                        created_at: new Date(deviceHistory.created_at * 1000).toLocaleDateString('de-DE', dateOptions),
                        status: deviceHistory.status,
                        deviceId: deviceHistory.deviceId
                    };
                    this._manageService.addEntry(historyItem);
                    this.isLoading = true;
                }
                this._manageService.getResults();
                this.isLoading = false;
            }, error =>
            {
                console.log('error while loading history data');
            }
        );

    }

    protected executeGroupFunction(selectedRows:Array<TerraDataTableRowInterface<HistoryDataTableInterface>>):void
    {
        this.manageOverlay.showOverlay();
    }

    protected executePopupFunction(selectedRows:Array<TerraDataTableRowInterface<HistoryDataTableInterface>>):void
    {
        if(!this.sendMailOption && !this.giveBackOption)
        {
            this._alert.error('Es wurde keine Aktion ausgewählt');
            return;
        }
        this.manageOverlay.hideOverlay();

        for(let row of selectedRows)
        {
            let data = {
                userId: row.data.user.id,
                deviceId: row.data.deviceId
            };

            if(this.sendMailOption)
            {
                this._statsDataService.putRestCallData('plugin/equipmentRental/rentalDevice/remindEmail',data).subscribe((response:Array<any>) =>
                    {
                        this._alert.success('Die Aktion wurde erfolgreich ausgeführt');
                    }, error =>
                    {
                        this._alert.error('Fehler beim Senden der E-Mail an '+row.data.user.email);
                    }
                );
            }

            if(this.giveBackOption)
            {
                let extraData:any = {
                    comment : "",
                    status: ""
                };
                this._statsDataService.putRestCallData('plugin/equipmentRental/rentalDevice/' + row.data.deviceId, extraData).subscribe((response:Array<any>) =>
                    {
                        this._alert.success('Das Gerät wurde erfolgreich zurückgegeben');
                        this._manageService.removeEntryByDeviceId(row.data.deviceId);
                        this._manageService.getResults();

                    }, error =>
                    {
                        this._alert.error('Fehler beim Zurückgeben des Gerätes');
                    }
                );
            }
        }
        this.giveBackOption = false;
        this.sendMailOption = false;
        //this.loadHistoryData();
    }

    public expiredDateClass(rent_until:number):string
    {
        if(this.isNumber(rent_until))
        {
            if(rent_until < 0)
                return "red"
            else if(rent_until == 0)
                return "yellow"
        }
        return "";
    }

    public isNumber(object:any):boolean
    {
        return typeof object === 'number';
    }

    public formatSingularPlural(count:number, singular:string, plural:string):string
    {
        return count === 1 || count === -1 ? singular : plural;
    }

    public capitalize(str:string):string
    {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

}
