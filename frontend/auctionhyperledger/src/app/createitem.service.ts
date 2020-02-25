import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface AuthResponseData{
  response: string;
}

@Injectable({
  providedIn: 'root'
})
export class CreateitemService {

  constructor(private http: HttpClient) { }


  createitem( itemId:string, name: string, value: string, owner: string) {
    
    return this.http.post<AuthResponseData>('http://192.168.30.34:4000/login',
       {   
        
        itemId:itemId,
        name: name,
        value: value,
        owner:owner
      });
    }
}
