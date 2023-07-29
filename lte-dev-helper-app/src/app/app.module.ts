import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontsComponent } from './fonts/fonts.component';
import { CharmapComponent } from './charmap/charmap.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MessagesComponent } from './messages/messages.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegexTesterComponent } from './regex-tester/regex-tester.component';
import { UriBuilderComponent } from './uri-builder/uri-builder.component';

@NgModule({
  declarations: [
    AppComponent,
    FontsComponent,
    CharmapComponent,
    DashboardComponent,
    MessagesComponent,
    RegexTesterComponent,
    UriBuilderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
