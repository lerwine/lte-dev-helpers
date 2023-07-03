import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LINKS } from './app-routing.module';

interface INavLink {
  url: string;
  title: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Lenny\'s Dev Helpers';
  constructor(public route: ActivatedRoute) {}

  links: INavLink[] = [];

  ngOnInit(): void {
    this.links = LINKS.map(r =>
      <INavLink>{
        url: '/' + r.path,
        title: r.title
      });
  }

}
