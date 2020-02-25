import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { async } from '@angular/core/testing';



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
    const email = form.value.email;
    const password = form.value.password;

    this.loginService.login(email, password).subscribe(resData=>{
      console.log(resData);
      this.setSession(resData);
      this.router.navigate(["dashboard"]);
    },
    error => {
    console.log(error);

    });
    form.reset();
  }
  // setSession(authResult) {
  //   localStorage.setItem('token',authResult.token);
  //   console.log(localStorage.getItem("token"));
  //    }

  setSession(authResult) {
    localStorage.setItem('token',authResult.token);
    var decoded = jwt_decode(localStorage.getItem("token")); 
    console.log(decoded);
    // console.log(localStorage.getItem("token"));

    var role = decoded.role;

    console.log(role);

     
     if (role=="auditor") {
      this.router.navigate(['dashboardauditor']);
     }
      else if(role=="auctiondepartment") {
      this.router.navigate(['dashboard']);
      }
      else if(role=="bidder"){
       //  let username=this.email;
       //  let password=this.password1;
       // if((username=="admin")&&(password=="admin"))
       // {
       
       this.router.navigate(['dashboardbidder']);
       // }

      }
      else{
       alert("user not authorized")
      }

    }

}
