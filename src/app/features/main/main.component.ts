import {Component, inject} from '@angular/core';
import {filter} from "rxjs/operators";
import {ApartmentStore} from "../../services/apartments-store.service";
import {LetDirective} from "@ngrx/component";
import {SummerComponent} from "./summer.component";
import {AuthStore} from "../../services/authentication/auth-store";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MenuComponent} from "./menu.component";
import {Layout} from "../../domain/layout";
import {PanelComponent} from "./panel.component";

@Component({
    selector: 'dema-main',
    imports: [LetDirective, SummerComponent, MatGridList, MatGridTile, MenuComponent, PanelComponent],
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss',
})
export class MainComponent {
    private store = inject(ApartmentStore);
    private auth = inject(AuthStore);

    loggedIn$ = this.auth.isLoggedIn$;
    roles$ = this.auth.roles$;
    columns$ = this.store.columns$.pipe(filter((e) => !!e));
    selectedIso$ = this.store.selectedIso$;
    cornerRadius$ = this.store.cornerRadius$;
    activeDetail$ = this.store.selectedDetailPage$.pipe(filter((e) => !!e));
    header$ = this.store.header$;
    stateLayout$ = this.store.stateLayout$;
    backgroundColorSummer$=this.store.backgroundColorSummer$;
    backgroundColorPanel$=this.store.backgroundColorPanel$;
    actionsBorderColorSummer$=this.store.actionsBorderColorSummer$;
    actionsBorderColorPanel$=this.store.actionsBorderColorPanel$;
    shrinkMenu$ = this.store.shrinkMenu$;
    isMobile$ = this.store.isMobile$;
    disableAddingNewPanels$ = this.store.disableAddingNewPanels$;

    protected readonly Layout = Layout;
}
