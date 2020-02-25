import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
interface AuthResponseData{
  response: string;
}
@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient) { }

  signup(firstName: string,middleName:string, lastName:string,email:string,phoneNumber:string,password: string,role:string) {


    // const token = localStorage.getItem('token');
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type':  'application/json',
    //     'Authorization': 'Bearer '+token
    //   })
    // };

    
    return this.http.post<AuthResponseData>('http://localhost:4000/signup',
       {   
        firstName: firstName,
        middleName:middleName,
        lastName: lastName,
        email:email,
        phoneNumber:phoneNumber,
        password:password,
        role:role
      
      });
}


}
