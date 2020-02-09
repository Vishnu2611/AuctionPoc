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


  createbid(userName: string, auctionId:string, bidAmount: string) {
    
    return this.http.post<AuthResponseData>('http://192.168.30.34:4000/login',
       {   
        userName: userName,
        auctionId:auctionId,
        bidAmount: bidAmount
       
      });
    }
}
