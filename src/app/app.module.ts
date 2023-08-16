import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { AuthService } from './services/auth.service';
import { GetEmpListService } from './services/get-emp-list.service';
import { EmpListComponent } from './components/emp-list/emp-list.component';
import { SharingService } from './services/sharing.service';
import { MarkAttendanceService } from './services/mark-attendance.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { Router, RouterModule, Routes } from '@angular/router';
import { ModalBoxComponent } from './components/modal-box/modal-box.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppServiceService } from './services/app-service.service';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { OtpValidationComponent } from './components/otp-validation/otp-validation.component';
import { OtpVerificationService } from './services/otp-verification.service';
import { CountdownComponent } from 'ngx-countdown';
import { NgOtpInputModule } from 'ng-otp-input';


const appRoute : Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', redirectTo: 'home', pathMatch: 'full' },
  {path: 'otp-validation', redirectTo: 'otp-validation', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'otp-validation', component: OtpValidationComponent},
  {path: 'home', component: HomeComponent},
  {path: 'empList', component: EmpListComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    EmpListComponent,
    ModalBoxComponent,
    SplashScreenComponent,
    OtpValidationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    HttpClientModule,
    RouterModule.forRoot(appRoute, {useHash: true}),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    NgbModule,
    BrowserAnimationsModule,
    CountdownComponent,
  ],
  
  providers: [ AuthService, GetEmpListService, SharingService, MarkAttendanceService, AppServiceService, OtpVerificationService ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(){}
 }
