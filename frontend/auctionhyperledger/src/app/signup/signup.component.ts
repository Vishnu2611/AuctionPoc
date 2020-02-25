import { Component, OnInit } from '@angular/core';
import { SignupService } from '../signup.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  constructor(private signupService: SignupService,private router: Router) { }

 
  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    const firstName = form.value.firstName;
    const middleName = form.value.middleName;
    const lastName= form.value.lastName;
    const email= form.value.email;
    const phoneNumber= form.value.phoneNumber;
    const password= form.value.password;
    const role= form.value.role;


    
    this.signupService.signup(firstName, middleName,lastName,email,phoneNumber,password,role).subscribe(resData=>{
      console.log(resData);
      this.router.navigate(["/"]);
    
    },
    error => {
    console.log(error);

    });
    form.reset();
  }

}
