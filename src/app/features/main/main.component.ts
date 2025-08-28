import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {filter} from "rxjs/operators";
import {ApartmentStore} from "../../services/apartments-store.service";
import {LetDirective} from "@ngrx/component";
import {SummerComponent} from "./summer.component";
import {AuthStore} from "../../services/authentication/auth-store";
import {ShareableService} from "../../services/shareable.service";

@Component({
  selector: 'dema-main',
  imports: [LetDirective, SummerComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit, OnDestroy {
  private store = inject(ApartmentStore);
  private shareableService = inject(ShareableService);
  private auth = inject(AuthStore);

  loggedIn$ = this.auth.isLoggedIn$;
  columns$ = this.store.columns$.pipe(filter((e) => !!e));
  selectedIso$ = this.shareableService.getSelectedIso();

  ngOnInit(): void {
    // const segment = this.activatedRoute.snapshot.url.map(segment => segment.path).join('/');
    console.log("MAIN Component init");
  }

  ngOnDestroy(): void {

  }

}
