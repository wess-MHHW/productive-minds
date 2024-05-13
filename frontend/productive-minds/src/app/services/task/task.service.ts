import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Task } from '../../interfaces/task';
import { formatTask } from '../../utils/functions/format-task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  http: HttpClient = inject(HttpClient);
  search: Subject<string> = new Subject();
  getTasks(query: string): Observable<any> {
    return this.http.get('http://localhost:3000/task/filter' + query);
  }

  searchTasks(query: string): Observable<any> {
    return this.http.get('http://localhost:3000/task/filter?title=' + query);
  }

  updateTask(data: any): Observable<any> {
    let body = formatTask(data);

    return this.http.patch(
      'http://localhost:3000/task/update/' + data._id,
      body
    );
  }

  createTask(task: Task): Observable<any> {
    let body = {
      title: task.title,
      description: task.description,
      category: task.category.title,
      tags: task.tags.map((tag) => tag.title),
      date: new Date(task.date).toISOString(),
    };

    return this.http.post('http://localhost:3000/task/create', body);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete('http://localhost:3000/task/delete/' + id);
  }
}
