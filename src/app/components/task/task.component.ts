import { Component, OnInit, Inject } from '@angular/core';
import { ITodo } from '../../interfaces/ITodo';
import { TodoService } from '../../services/todo.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { Mtask } from '../../Models/mtask';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { DialogEditTaskComponent } from '../dialog-edit-task/dialog-edit-task.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  selectedTodo: ITodo;
  showTooltipTask: string = 'hide';
  tasks: ITodo[] = [];
  values: string = "";
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  finish : boolean = false;

  constructor(private todoService: TodoService,
              private _snackBar: MatSnackBar,
              public dialog: MatDialog
    ) { }

  ngOnInit() {
    this.getTasks();
  }

  onKey(event: any) { // without type info
    if (event.keyCode === 13) {
      this.values = event.target.value;
      this.add(this.values);
      event.target.value = "";
    }
  }

  addMessage(event: any) {
    if (event.keyCode === 13 && this.values) {
      this._snackBar.open(this.values, "Tâche Ajouté", {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  onSelect(task: ITodo): void {
    this.selectedTodo = task;
    this.openDialog(task);
  }

  finishTask(task: ITodo) {
    this.selectedTodo = task;
    if(this.selectedTodo.finish === false){
      this.selectedTodo.finish = true;
    }else{
      this.selectedTodo.finish = false;
    }
    this.save(this.selectedTodo, "Tâche terminée");
  }

  openDialog(data : ITodo): void {
    if(data['@id'] != undefined){
      const dialogRef = this.dialog.open(DialogEditTaskComponent, {
        width: '250px',
        data: {id: data['@id'], description: data.description}
      });

      dialogRef.afterClosed().subscribe(result => {
        if(data['@id'] != undefined){
          this.save(result, "Tâche Modifié");
        }
      });
    }
  }

  save(data: ITodo, text: string): void {
    this.todoService.updateTask(data)
      .subscribe(
        () => {
          this.getTasks();
          this._snackBar.open(this.selectedTodo.description, text, {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
      },
      error => {
        console.log(error);
      }
    );
  }

  add(description: string): void {
    description = description.trim();
    let finish = false;
    if (!description) { return; }
    this.todoService.addTask({ description, finish } as unknown as ITodo)
    .subscribe(task => {
        this.tasks.push(task);
      });
  }

  delete(task: ITodo): void {
    //this.tasks = this.tasks.filter(h => h !== task);
    console.log(this.tasks[0]['@id']);
    this.todoService.deleteTask(this.tasks[0]['@id'])
    .subscribe(
      () => {
        this.getTasks();
        this._snackBar.open(task.description, 'Tâche supprimée', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
    },
    error => {
      console.log(error);
    }
    );
  }

  getTasks(): void {
    this.todoService.getTaskList()
      .subscribe(
          (value: ITodo[]) => this.tasks = value,
          (error) => {
            console.log(error);
          },
          () => {
            console.log('completed !');
          }
      );
  }

}
