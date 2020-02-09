import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuctiondepartmentComponent } from './auctiondepartment/auctiondepartment.component';
import { AuditorComponent } from './auditor/auditor.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { ViewbidComponent } from './viewbid/viewbid.component';
import { CreatebidComponent } from './createbid/createbid.component';
import { CreateitemComponent } from './createitem/createitem.component';
import { ViewitemComponent } from './viewitem/viewitem.component';
import { DashboardauditorComponent } from './dashboardauditor/dashboardauditor.component';
import { DashboardbidderComponent } from './dashboardbidder/dashboardbidder.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    AuctiondepartmentComponent,
    AuditorComponent,
    ViewbidComponent,
    CreatebidComponent,
    CreateitemComponent,
    ViewitemComponent,
    DashboardauditorComponent,
    DashboardbidderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgZorroAntdModule,
    BrowserAnimationsModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule { }
