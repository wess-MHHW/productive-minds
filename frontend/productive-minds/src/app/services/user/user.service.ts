import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../interfaces/category';
import { Tag } from '../../interfaces/tag';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http: HttpClient = inject(HttpClient);

  getUser(): Observable<any> {
    return this.http.get('http://localhost:3000/user/get');
  }

  updateUser(data: Record<string, string>): Observable<any> {
    return this.http.patch('http://localhost:3000/user/update', data, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  deleteUser(password: string): Observable<any> {
    return this.http.delete('http://localhost:3000/user/delete', {
      headers: { 'Content-Type': 'application/json' },
      body: { password },
    });
  }

  updateCategories(categories: Array<Category>): Observable<any> {
    return this.http.patch(
      'http://localhost:3000/user/categories/update-all',
      { categories },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  updateTags(tags: Array<Tag>): Observable<any> {
    return this.http.patch(
      'http://localhost:3000/user/tags/update-all',
      { tags },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  addCategory(category: Category): Observable<any> {
    return this.http.post(
      'http://localhost:3000/user/categories/add',
      category,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  deleteCategory(title: string): Observable<any> {
    return this.http.delete(
      'http://localhost:3000/user/categories/delete',

      { headers: { 'Content-Type': 'application/json' }, body: { title } }
    );
  }

  deleteCategories(): Observable<any> {
    return this.http.delete('http://localhost:3000/user/categories/delete-all');
  }

  addTag(tag: Tag): Observable<any> {
    return this.http.post('http://localhost:3000/user/tags/add', tag, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  deleteTag(title: string): Observable<any> {
    return this.http.delete(
      'http://localhost:3000/user/tags/delete',

      { headers: { 'Content-Type': 'application/json' }, body: { title } }
    );
  }

  deleteTags(): Observable<any> {
    return this.http.delete('http://localhost:3000/user/tags/delete-all');
  }
}
