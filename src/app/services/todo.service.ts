import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import {ITodo} from '../interfaces/ITodo';
import {Mtask} from '../Models/mtask';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private todolistUrl = 'https://dcode.design/api_todolist/api/todos';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json', /*or whatever type is relevant */
      'Accept': 'application/json' /* ditto */
    })
  };

  constructor(private http: HttpClient) {
  }

  private log(message: string) {
    //console.log(`todoService: ${message}`);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** GET ITodo from the server */
  getTaskList(): Observable<ITodo[]> {
    return this.http.get<ITodo[]>(this.todolistUrl)
      .pipe(
        map(data => data['hydra:member'],
          tap(_ => this.log('fetched ITodo')),
        )
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getTask(id: number): Observable<ITodo> {
    const url = `${this.todolistUrl}/${id}`;
    return this.http.get<ITodo>(url).pipe(
      tap(_ => this.log(`fetched todo id=${id}`)),
      catchError(this.handleError<ITodo>(`getTask id=${id}`))
    );
  }

  /* GET heroes whose name contains search term */
  searchTasklist(term: string): Observable<ITodo[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<ITodo[]>(`${this.todolistUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found todo matching "${term}"`) :
        this.log(`no todo matching "${term}"`)),
      catchError(this.handleError<ITodo[]>('searchTasklist', []))
    );
  }

  /** POST: add a new hero to the server */
  addTask(todo: ITodo): Observable<ITodo> {
    return this.http.post<ITodo>(this.todolistUrl, todo, this.httpOptions).pipe(
      tap((newTodo: ITodo) => this.log(`added hero w/ id=${newTodo.id}`)),
      catchError(this.handleError<ITodo>('addTask'))
    );
  }

  /** PUT: update the hero on the server */
  updateTask(todo: ITodo): Observable<any> {
    let atId;
    if (todo['@id'] != undefined) {
      atId = todo['@id'];
      atId = atId.split('/').pop();
    } else {
      atId = todo.id.toString();
      atId = atId.split('/').pop();
    }

    const url = `${this.todolistUrl}/${atId}`;
    return this.http.put(url, todo, this.httpOptions)
      .pipe(
        tap(_ => this.log(`updated todo id=${todo.id}`)),
        catchError(this.handleError<any>('updateTask'))
      );
  }

  /** DELETE: delete the hero from the server */
  deleteTask(atId: string): Observable<ITodo> {
    atId = atId.split('/').pop();
    const url = `${this.todolistUrl}/${atId}`;

    return this.http.delete<ITodo>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted todo id=${atId}`)),
      catchError(this.handleError<ITodo>('deleteTodo'))
    );
  }
}
