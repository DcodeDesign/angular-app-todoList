import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TodoService } from '../../services/todo.service';
import { ITodo } from '../../interfaces/ITodo';


@Component({
  selector: 'app-dialog-edit-task',
  templateUrl: './dialog-edit-task.component.html',
  styleUrls: ['./dialog-edit-task.component.scss']
})
export class DialogEditTaskComponent {

  @Input() tasks: ITodo = this.data

  constructor(
    public dialogRef: MatDialogRef<DialogEditTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ITodo,
    private todoService: TodoService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
