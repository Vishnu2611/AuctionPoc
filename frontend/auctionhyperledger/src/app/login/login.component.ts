import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {

  constructor(private loginService: LoginService,private router: Router) { }


  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    const userName = form.value.userName;
    const password = form.value.password;

    this.loginService.login(userName, password).subscribe(resData=>{
      console.log(resData);
      this.setSession(resData);
      this.router.navigate(["dashboard"]);
    },
    error => {
    console.log(error);

    });
    form.reset();
  }
  setSession(authResult) {
    localStorage.setItem('token',authResult.token);
    console.log(localStorage.getItem("token"));
     }
}
