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
    const userName = form.value.userName;
    const orgName = form.value.orgName;
    const password= form.value.password;
   

    this.signupService.signup(userName, orgName,password).subscribe(resData=>{
      console.log(resData);
      this.router.navigate(["/"]);
    
    },
    error => {
    console.log(error);

    });
    form.reset();
  }

}
