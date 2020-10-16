import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { ITodo } from '../interfaces/ITodo';

@Injectable({
  providedIn: 'root'
})
export class TodoDataService implements InMemoryDbService  {

  createDb() {
    const todolist = [
      { id: 0, desc: "Aller en cours", finish: false },
      { id: 1, desc: "Aller au garage", finish: false },
      { id: 2, desc: "Acheter du pain", finish: true  },
      { id: 3, desc: "Tondre le jardin", finish: false  },
      { id: 4, desc: "Aller chez le médecin", finish: true },
      { id: 5, desc: "Payer les factures", finish: false  },
      { id: 6, desc: "Nettoyer la voiture", finish: false  },
      { id: 7, desc: "Faire les courses", finish: false  }
    ];
    return {todolist};
  }

  genId(todolist: ITodo[]): number {
    return todolist.length > 0 ? Math.max(...todolist.map(todo => todo.id)) + 1 : 1;
  }
}
