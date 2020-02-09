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

  
  login(userName: string, password: string) {
    
    return this.http.post<AuthResponseData>('http://localhost:4000/login',
       {   
        userName: userName,
        password: password
      });
}
}
