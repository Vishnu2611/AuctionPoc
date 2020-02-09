import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuctiondepartmentComponent } from './auctiondepartment/auctiondepartment.component';
import { AuditorComponent } from './auditor/auditor.component';
import { ViewbidComponent } from './viewbid/viewbid.component';
import { CreatebidComponent } from './createbid/createbid.component';
import { CreateitemComponent } from './createitem/createitem.component';
import { ViewitemComponent } from './viewitem/viewitem.component';
import { DashboardauditorComponent } from './dashboardauditor/dashboardauditor.component';
import { DashboardbidderComponent } from './dashboardbidder/dashboardbidder.component';


const routes: Routes = [ 
{path: '', component: LoginComponent},
{path: 'signup', component: SignupComponent},
{path: 'dashboard', component: DashboardComponent},
{path: 'auctiondepartment', component: AuctiondepartmentComponent},
{path: 'auditor', component: AuditorComponent},
{path: 'viewbid', component: ViewbidComponent},
{path: 'createbid', component: CreatebidComponent},
{path: 'viewitem', component: ViewitemComponent},
{path: 'createitem', component: CreateitemComponent},
{path: 'dashboardauditor', component: DashboardauditorComponent},
{path: 'dashboardbidder', component: DashboardbidderComponent},







];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
