import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


interface AuthResponseData{
  response: string;
}
@Injectable({
  providedIn: 'root'
})
export class CreatebidService {

  constructor(private http: HttpClient) { }


  createbid( auctionId:string, bidValue: string,owner: string,) {
    
    return this.http.post<AuthResponseData>('http://192.168.30.34:4000/login',
       {   
        
        auctionId:auctionId,
        bidValue: bidValue,
        owner: owner
      });
    }
}
