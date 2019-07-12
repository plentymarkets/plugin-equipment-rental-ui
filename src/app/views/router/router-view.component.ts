import {
    Component,
    ViewChild
} from '@angular/core';
import {
    TerraBreadcrumbsComponent,
    TerraBreadcrumbsService
} from '@plentymarkets/terra-components';

@Component({
    selector: 'router-view',
    template: require('./router-view.component.html'),
    styles:   [require('./router-view.component.scss')]
})
export class RouterViewComponent
{
    @ViewChild(TerraBreadcrumbsComponent)
    private breadcrumbs:TerraBreadcrumbsComponent;

    public get breadcrumbsService():TerraBreadcrumbsService
    {
        return this.breadcrumbs.breadcrumbsService;
    }
}
