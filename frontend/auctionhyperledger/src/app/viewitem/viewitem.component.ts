import { Component, OnInit } from '@angular/core';
import { ViewitemService } from '../viewitem.service';

@Component({
  selector: 'app-viewitem',
  templateUrl: './viewitem.component.html',
  styleUrls: ['./viewitem.component.css']
})
export class ViewitemComponent implements OnInit {

  constructor( private viewitemService: ViewitemService) { }
  public detailss;
  async details(){
    
    this.viewitemService.getDetails().subscribe(res => {this.detailss = res.info; 
    console.log(this.detailss)} ); }

    ngOnInit() {
      this.details();
    }

}
