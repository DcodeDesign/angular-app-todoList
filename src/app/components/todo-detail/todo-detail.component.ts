import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { TodoService } from '../../services/todo.service';
import { ITodo } from '../../interfaces/ITodo';

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.scss']
})
export class TodoDetailComponent implements OnInit {

  @Input()
  todo: ITodo;

  constructor(
    private route: ActivatedRoute,
    private todoService: TodoService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getTask();
    console.log(this.todo)
  }

  getTask () : void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.todoService.getTask(id)
      .subscribe(todo => this.todo = todo);
  }

  save(): void {
    this.todoService.updateTask(this.todo)
      .subscribe(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }

}
