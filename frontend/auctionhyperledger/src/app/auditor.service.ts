import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuditorService {

constructor(private http: HttpClient) { }
getDetails() {
    return this.http.get('http://localhost:3000/getauction');
  }

}
