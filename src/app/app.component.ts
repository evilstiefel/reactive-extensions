import { Component } from '@angular/core';
import { DataService } from './services/data.service';
import { UserService } from './services/user-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'reactive-extensions';

  navLinks: { label: string, path: string }[] = [
    {
      label: 'Eingabe',
      path: 'input'
    },
    {
      label: 'Requests',
      path: 'user'
    }
  ];

  constructor(private _data: DataService, private _user: UserService) { }
}
