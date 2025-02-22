import { Component } from '@angular/core';
import { AJobComponent } from "../a-job/a-job.component";

@Component({
  selector: 'app-main',
  imports: [AJobComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
