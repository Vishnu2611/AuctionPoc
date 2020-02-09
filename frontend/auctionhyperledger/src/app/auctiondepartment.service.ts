import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
interface AuthResponseData{
  response: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuctiondepartmentService {

  constructor(private http: HttpClient) { }


  auctiondepartment(auctionId: string,basePrice:string, startTime: string,endTime: string,auctionDetails, status:string) {


    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer '+token
      })
    };
    
    return this.http.post<AuthResponseData>('http://localhost:3000/auction',
       {   
        auctionId: auctionId,
        basePrice:basePrice,
        startTime: startTime,
        endTime:endTime,
        auctionDetails:auctionDetails,
        status:status
      });

    

}
}
