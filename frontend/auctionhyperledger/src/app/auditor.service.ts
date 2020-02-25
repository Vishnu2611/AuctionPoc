import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
interface res {
  info: any;
  message: any;
}

@Injectable({
  providedIn: 'root'
})

export class AuditorService {
  
constructor(private http: HttpClient) { }
getDetails() {
    return this.http.get<res>('http://localhost:3000/getauction');
  }

}
