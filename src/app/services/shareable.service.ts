import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {defaultIso} from "../domain/countries-iso";

@Injectable({
    providedIn: 'root'
})
export class ShareableService {

    private selectedIsoSubject: BehaviorSubject<string> = new BehaviorSubject<string>(defaultIso);

    setSelectedIso(data: string): void {
        this.selectedIsoSubject.next(data);
    }

    getSelectedIso(): Observable<string> {
        return this.selectedIsoSubject.asObservable();
    }
}