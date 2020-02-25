import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CreatebidService} from '../createbid.service';



@Component({
  selector: 'app-createbid',
  templateUrl: './createbid.component.html',
  styleUrls: ['./createbid.component.css']
})
export class CreatebidComponent  {

  constructor(private createbidService: CreatebidService) { }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
   
    const auctionId = form.value.auctionId;
    const bidValue= form.value.bidValue;
    const owner = form.value.owner;

    this.createbidService.createbid( auctionId, bidValue,owner).subscribe(resData=>{
      console.log(resData);
    
    },
    error => {
    console.log(error);

    });
    form.reset();
  }


}
