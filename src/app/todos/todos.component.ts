import {Component} from '@angular/core';
import {Todo} from "../models/todo";
import {FormsModule} from "@angular/forms";
import {NgClass, NgFor, NgIf} from "@angular/common";
import {TodoService} from "../services/todo.service";

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, NgClass],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css'
})
export class TodosComponent {
  todos: Todo[] = [];
  inputValue = '';
  isOngoing = false;


  constructor(private todoService: TodoService) {
    this.fetchTodos()
  }

  onAdd() {
    if (this.inputValue) {
      let todo: Todo = {
        description: this.inputValue,
        completed: false,
        isEditing: false
      };
      this.todoService.add(todo)
      this.fetchTodos()
      this.inputValue = ''
      this.isOngoing = false;
    }
  }

  onDelete(index: number) {
    const confirmed = confirm("Are you sure?");
    if(confirmed) {
      this.todoService.delete(index);
      this.fetchTodos();
    }
    this.isOngoing = false;
  }

  onEdit(index: number) {
    if (this.isOngoing == true){
      return
    }
    this.todos[index].isEditing = true;
    this.isOngoing = true;
  }

  onSave(index: number, value: string) {
    if (value){
      const edited = this.todos[index];
      edited.isEditing = false;
      edited.description = value;
      this.todoService.update(edited, index)
      this.fetchTodos();
    }else{
      alert ("You must input value.")
    }
    this.isOngoing = false;
  }

  onCancel(index: number) {
    this.todos[index].isEditing = false;
    this.todos[index] = {...this.todos[index]};
    this.isOngoing =false;
  }

  onCheckboxChange(todo: Todo, index: number): void {
    this.todoService.update(todo, index);
    this.fetchTodos();
  }

  private fetchTodos(): void {
    this.todos = this.todoService.getAll();
  }
}
