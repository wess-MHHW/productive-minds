import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StickyWallService {
  http: HttpClient = inject(HttpClient);
  getStickies(): Observable<any> {
    return this.http.get('http://localhost:3000/sticky-wall/get-all');
  }

  createSticky(content: string): Observable<any> {
    return this.http.post('http://localhost:3000/sticky-wall/create', {
      content,
    });
  }

  updateSticky(id: string, content: string): Observable<any> {
    return this.http.patch('http://localhost:3000/sticky-wall/update/' + id, {
      content,
    });
  }

  deleteSticky(id: string): Observable<any> {
    return this.http.delete('http://localhost:3000/sticky-wall/delete/' + id);
  }

  deleteAllStickies(): Observable<any> {
    return this.http.delete('http://localhost:3000/sticky-wall/delete-all');
  }
}
