import { NgModule, Type } from '@angular/core';
import { RouterModule, Routes, Route } from '@angular/router';
import { FontsComponent } from './fonts/fonts.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CharmapComponent } from './charmap/charmap.component';
import { RegexTesterComponent } from './regex-tester/regex-tester.component';

export interface IAppRoute extends Route {
  title: string;
  path: string;
}

export const LINKS: IAppRoute[] = [
  { path: "dashboard", component: DashboardComponent, title: "Home" },
  { path: "fonts", component: FontsComponent, title: "Character Maps" },
  { path: "regex", component: RegexTesterComponent, title: "Regular Expression Tester" }
]
const routes: Routes = (<Route[]>LINKS).concat([
  { path: 'charmap/:id', component: CharmapComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
]);

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
