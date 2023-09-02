import { Component,OnInit, OnChanges,TemplateRef, ViewChild} from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { OtpVerificationService } from 'src/app/services/otp-verification.service';
import data from "../../../assets/json/data.json";
import { App } from '@capacitor/app'
import { PluginListenerHandle } from '@capacitor/core';
// import { Plugins} from '@capacitor/core';

// import { App } from Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  orgData = data;
  alertMessage = '';
  type: string = "password";
  eyeIcon: string = "fa-eye-slash";
  isText: boolean = false;
  loginForm!: FormGroup;
  isLoading: Boolean = false;
  closeResult = '';
  counter = 0;
  newData:any;
  @ViewChild('default') defaultTemplate!: TemplateRef<any>;
  
  constructor(private otp: OtpVerificationService,
    private modalService: NgbModal,private fb: FormBuilder, 
    private router: Router, private auth : AuthService){

      App.addListener('backButton', this.BackButtonListener)

      // App.addListener('backButton', ({canGoBack}) => {
      //   App.exitApp();
      // });
    
    // this tells that both the field is necessary
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }
  BackButtonListener(){
    App.exitApp();
  }



  // when we click on eye-icon 
  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }


  onSubmit(){
    // if both the field has some text then procced else show message
    if(this.loginForm.valid){
      this.isLoading = true;
      // function call to auth service to send http request
      this.auth.getUsers(this.loginForm.value).subscribe(
        (data: any) => {
          this.newData = data;
          setTimeout(() => {
            this.isLoading = false;
            // if the Msg is success store the user credentials and response data in local storage and send user to otp validation page
            if (this.newData.Table[0].Msg == "SUCCESS"){
              localStorage["UserDetails"] = JSON.stringify(this.loginForm.value)
              localStorage["UserLoginData"] = JSON.stringify(this.newData);
              if(this.newData.Table[0].IsOTPSend == 1){
                this.otp.otpgeneration(this.loginForm.value);
              }
              this.router.navigate(['/otp-validation']);
            // if the Msg is not success open a message box with alert Message and reset the form
            }else{
              this.loginForm.reset();
              this.alertMessage = "Wrong Username/Password";
              this.open(this.defaultTemplate)
              this.isLoading = false;
            }
          }, 1000);
        },
        (err : any) => {
        this.loginForm.reset();
        this.alertMessage = "Wrong Username/Password";
        this.open(this.defaultTemplate)
        this.isLoading = false;
        
        }
      );
    }else{
      this.validateAllFormFields(this.loginForm);
    }
  }

  private validateAllFormFields(formGroup : FormGroup){
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if(control instanceof FormControl){
        control.markAsDirty({onlySelf:true})
      }else if( control instanceof FormGroup){
        this.validateAllFormFields(control)
      }
    })
  }

  // function to open message box
  open(template: TemplateRef<any> = this.defaultTemplate) {
		this.modalService.open(template, { ariaLabelledBy: 'modal-basic-title' })
	}

  goto(st: String){
    if(st == 'privacy-policy'){
      this.router.navigate(['/privacy-policy']);
    }else if(st == 'terms-condition'){
      this.router.navigate(['/terms-and-condition']); 
    }
  }
}


