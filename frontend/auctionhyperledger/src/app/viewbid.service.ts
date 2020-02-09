import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ViewbidService {

 
  constructor(private http: HttpClient) { }

  getDetails() {
    return this.http.get('http://192.168.43.222:4000/certificate/pending');
  }
}
