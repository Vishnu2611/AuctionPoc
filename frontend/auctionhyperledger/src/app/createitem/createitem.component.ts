import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CreateitemService} from '../createitem.service';

@Component({
  selector: 'app-createitem',
  templateUrl: './createitem.component.html',
  styleUrls: ['./createitem.component.css']
})
export class CreateitemComponent  {

  constructor(private createitemService: CreateitemService) { }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
   
    const itemId = form.value.itemId;
    const name= form.value.name;
    const value = form.value.value;
    const owner = form.value.owner;
    
    this.createitemService.createitem( itemId, name,value,owner).subscribe(resData=>{
      console.log(resData);
    
    },
    error => {
    console.log(error);

    });
    form.reset();
  }

}
