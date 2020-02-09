import { Component, OnInit } from '@angular/core';
import { AuditorService } from '../auditor.service';

@Component({
  selector: 'app-auditor',
  templateUrl: './auditor.component.html',
  styleUrls: ['./auditor.component.css']
})
export class AuditorComponent implements OnInit {
  constructor( private auditorService: AuditorService) { }
  public detailss;
  async details(){
  
    this.auditorService.getDetails().subscribe(res => {
      this.detailss = res.info;   
      // console.log(res);
      console.log(this.detailss)

     } ); 
            }

    ngOnInit() {
      this.details();
    }



  }
