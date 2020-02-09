import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuctiondepartmentService } from '../auctiondepartment.service';
@Component({
  selector: 'app-auctiondepartment',
  templateUrl: './auctiondepartment.component.html',
  styleUrls: ['./auctiondepartment.component.css']
})
export class AuctiondepartmentComponent {
  http: any;

  constructor(private auctiondepartmentService: AuctiondepartmentService) { }
  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    const auctionId = form.value.auctionId;
    const basePrice = form.value.basePrice;
    const startTime= form.value.startTime;
    const endTime = form.value.endTime;
    const auctionDetails = form.value.auctionDetails;
    const status = form.value.status;

    this.auctiondepartmentService.auctiondepartment(auctionId, basePrice,startTime,endTime,auctionDetails,status).subscribe(response=>{
      console.log(response);
    
    },
    error => {
    console.log(error);

    });
    form.reset();
  }



}
