import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface AuthResponseData{
  response: string;
}
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  
  login(email: string, password: string) {
    
    return this.http.post<AuthResponseData>('http://192.168.43.222:4000/login',
       {   
        email: email,
        password: password
      });
}
}
