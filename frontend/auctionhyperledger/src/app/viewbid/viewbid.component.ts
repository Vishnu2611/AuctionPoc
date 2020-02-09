import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { ViewbidService } from '../viewbid.service';

@Component({
  selector: 'app-viewbid',
  templateUrl: './viewbid.component.html',
  styleUrls: ['./viewbid.component.css']
})
export class ViewbidComponent  {

  constructor( private viewbidService: ViewbidService) { }
  public detailss;
  async details(){
    
    this.viewbidService.getDetails().subscribe(res => {this.detailss = res; 
    console.log(this.detailss)} ); }

    ngOnInit() {
      this.details();
    }

}
