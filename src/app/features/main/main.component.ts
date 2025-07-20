import {Component, inject, OnInit} from '@angular/core';
import {ApartmentsHttpService} from "../../services/apartments-http.service";
import {Router} from "@angular/router";

@Component({
  selector: 'dema-main',
  imports: [],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit{

  readonly service = inject(ApartmentsHttpService);
  readonly router = inject(Router);

  res: string = "";

  ngOnInit() {
    console.log("data ngOnInit")

    this.service.ping().subscribe(
        data => {
          console.log("data",data)
          this.res = data.text;
        }
    )
  }

}
