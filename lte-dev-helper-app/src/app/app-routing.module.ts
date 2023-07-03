import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FontsComponent } from './fonts/fonts.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CharmapComponent } from './charmap/charmap.component';
import { RegexTesterComponent } from './regex-tester/regex-tester.component';

const routes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "fonts", component: FontsComponent },
  { path: "regex", component: RegexTesterComponent },
  { path: 'charmap/:id', component: CharmapComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
