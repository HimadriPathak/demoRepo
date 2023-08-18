import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { EmpListComponent } from './components/emp-list/emp-list.component';
import { AppComponent } from './app.component';
import { ModalBoxComponent } from './components/modal-box/modal-box.component';
import { NgOtpInputModule } from 'ng-otp-input';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', redirectTo: 'home', pathMatch: 'full' },
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'empList', component: EmpListComponent},
  {path: 'modalbox', component: ModalBoxComponent}
];

@NgModule({
  imports: [
    NgOtpInputModule,
    RouterModule.forRoot(routes,{useHash: true})
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
