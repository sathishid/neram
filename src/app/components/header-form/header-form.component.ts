import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, of, startWith, forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-form',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatAutocompleteModule],
  templateUrl: './header-form.component.html',
  styleUrl: './header-form.component.scss'
})
export class HeaderFormComponent implements OnInit {
  headerFormGroup: FormGroup;
  keyControl: FormControl;
  titleControl: FormControl;
  categoryControl: FormControl;
  
  taskKeys: string[];
  taskTitles:  string[];
  taskCategories:  string[];
  taskKeyFilteredOptions: Observable<string[]>;

  constructor(private fb: FormBuilder) {
    this.taskKeyFilteredOptions = of([]);
    this.taskKeys = [];
    this.taskTitles = [];
    this.taskCategories = [];
    this.keyControl = new FormControl('');
    this.titleControl = new FormControl('');
    this.categoryControl = new FormControl('');
    this.headerFormGroup = this.fb.group({
      keyControl: this.keyControl,
      titleControl: this.titleControl,
      categoryControl: this.categoryControl
    });
  }

  ngOnInit() {
    forkJoin({
      keys: this.getTaskKeys(),
      titles: this.getTaskTitles(),
      categories: this.getTaskCategories()
    }).subscribe(({ keys, titles, categories }) => {
      this.taskKeys = keys;
      this.taskTitles = titles;
      this.taskCategories = categories;
    });

    this.taskKeyFilteredOptions = this.keyControl.valueChanges.pipe(
      startWith(''),
      map(value => this._taskKeyFilter(value))
    );
  }

  private _taskKeyFilter(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.taskKeys.filter(option => option.toLowerCase().includes(filterValue));
  }

  getTaskCategories(): Observable<string[]> {
    return of(['Category 1', 'Category 2', 'Category 3']);
  }

  getTaskTitles(): Observable<string[]> {
    return of(['Title 1', 'Title 2', 'Title 3']);
  }

  getTaskKeys(): Observable<string[]> {
    // Replace with your actual implementation to fetch task keys
    return of(['Key 1', 'Key 2', 'Key 3']);
  }
}
