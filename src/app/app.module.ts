import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './components-wip/homepage/homepage.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomepageV2Component } from './components-active/homepage-v2/homepage-v2.component';
import { AboutComponent } from './components-wip/about/about.component';
import { HistoryComponent } from './components-wip/history/history.component';
import { ExperimentalComponent } from './components-active/experimental/experimental.component';
import { About2Component } from './components-active/about2/about2.component';
import { History2Component } from './components-active/history2/history2.component';
import { EnterpriseComponent } from './components-active/enterprise/enterprise.component';
import {MatToolbarModule} from '@angular/material/toolbar';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    HomepageV2Component,
    AboutComponent,
    HistoryComponent,
    ExperimentalComponent,
    About2Component,
    History2Component,
    EnterpriseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
