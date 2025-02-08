import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { HeaderFormComponent } from "./components/header-form/header-form.component";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule,
    MatSidenavModule,
    MatListModule, HeaderFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'neram';
}
