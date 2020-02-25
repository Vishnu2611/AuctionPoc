import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
interface res {
  info: any;
  message: any;
}
@Injectable({
  providedIn: 'root'
})
export class ViewbidService {

 
  constructor(private http: HttpClient) { }

  getDetails() {
    return this.http.get<res>('http://192.168.43.222:4000/certificate/pending');
  }
}
