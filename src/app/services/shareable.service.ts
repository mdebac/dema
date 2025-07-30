import {Injectable} from "@angular/core";
import {Header} from "../domain/header";
import {BehaviorSubject, Observable} from "rxjs";
import {defaultIso} from "../domain/countries-iso";

@Injectable({
    providedIn: 'root'
})
export class ShareableService {

    private activeDetailUrlSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
   private selectedIsoSubject: BehaviorSubject<string> = new BehaviorSubject<string>(defaultIso);
    private segmentSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);


    setActiveDetailUrl(data: string | null): void {
        console.log("set ActiveDetailUrl", data);
        this.activeDetailUrlSubject.next(data);
    }
    getActiveDetailUrl(): Observable<string | null> {
        return this.activeDetailUrlSubject.asObservable();
    }

    setSegment(data: string): void {
        console.log("set Segment", data);
        this.segmentSubject.next(data);
    }
    getSegment(): Observable<string | null> {
        return this.segmentSubject.asObservable();
    }


    setSelectedIso(data: string): void {
        console.log("set SelectedIso", data);
        this.selectedIsoSubject.next(data);
    }
    getSelectedIso(): Observable<string> {
        return this.selectedIsoSubject.asObservable();
    }


}