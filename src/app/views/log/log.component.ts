import { Component, OnInit } from '@angular/core';
import {LogDataTableService} from "../../services/log-table.service";
import {TerraDataTableHeaderCellInterface, TerraTextAlignEnum} from "@plentymarkets/terra-components";

@Component({
  selector: 'ptb-log',
  templateUrl: './log.component.html',
  providers: [LogDataTableService]
})
export class LogComponent implements OnInit {
  private headerList:Array<TerraDataTableHeaderCellInterface> = [
    {
      caption: 'Name',
      sortBy:  'userId',
      width:   10,
      textAlign: TerraTextAlignEnum.LEFT
    },
    {
      caption: 'Gerät',
      sortBy:  'rentalItem',
      width:   10,
      textAlign: TerraTextAlignEnum.LEFT
    },
    {
      caption: 'Aktion',
      sortBy:  'message',
      width:   10,
      textAlign: TerraTextAlignEnum.LEFT
    },
    {
      caption:   'Datum',
      sortBy:    'created_at',
      width:     10,
      textAlign: TerraTextAlignEnum.LEFT
    }
  ];
  public filterDevice: number;
  public filterUser: number;

  private users: [];

  constructor(private logService:LogDataTableService)
  {}

  ngOnInit()
  {
    this.loadData();
  }

  private loadData() {
    this.logService.requestTableData({page: 1,itemsPerPage: 10});
  }

  private onSearchBtnClicked() {
    this.logService.clearEntrys();
    this.logService.getResults();
  }

  private onResetBtnClicked() {
    this.filterDevice = null;
    this.filterUser = null;
  }

  onDeviceFilterChange() {
    this.logService.filterDevice = this.filterDevice;
  }

  onUserFilterChange() {
    this.logService.filterUser = this.filterUser;
  }
}
