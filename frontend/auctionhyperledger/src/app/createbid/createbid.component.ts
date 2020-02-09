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
    const userName = form.value.userName;
    const auctionId = form.value.auctionId;
    const bidAmount= form.value.bidAmount;
   

    this.createbidService.createbid(userName, auctionId, bidAmount).subscribe(resData=>{
      console.log(resData);
    
    },
    error => {
    console.log(error);

    });
    form.reset();
  }


}
