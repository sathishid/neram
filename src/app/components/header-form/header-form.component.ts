import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { AJobComponent } from '../a-job/a-job.component';

@Component({
  selector: 'app-header-form',
  imports: [CommonModule, ReactiveFormsModule,
     MatFormFieldModule, MatAutocompleteModule,
     MatButtonModule,
     MatIconModule,AJobComponent],
  templateUrl: './header-form.component.html',
  styleUrl: './header-form.component.scss'
})
export class HeaderFormComponent  {
  

}
