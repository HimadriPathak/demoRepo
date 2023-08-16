import { Component,OnInit, OnChanges,TemplateRef, ViewChild} from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { OtpVerificationService } from 'src/app/services/otp-verification.service';
import data from "../../../assets/json/data.json";

const CACHE_KEY = "UserLoginData";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild('default') defaultTemplate!: TemplateRef<any>;
  alertMessage = '';
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  loginForm!: FormGroup;
  newData:any;
  isLoading: Boolean = false;
  closeResult = '';
  counter = 0;
  orgData = data;
  
  constructor(private otp: OtpVerificationService,private modalService: NgbModal,private fb: FormBuilder, private router: Router, private auth : AuthService){
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }
  ngOnInit(): void{
  }

  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  onSubmit(){
    if(this.loginForm.valid){
      this.isLoading = true;
      this.auth.getUsers(this.loginForm.value).subscribe(
        (data: any) => {
          this.newData = data;
          setTimeout(() => {
            this.isLoading = false;
            if (this.newData.Table[0].Msg == "SUCCESS"){
              localStorage["UserDetails"] = JSON.stringify(this.loginForm.value)
              localStorage[CACHE_KEY] = JSON.stringify(this.newData);
              if(this.newData.Table[0].IsOTPSend == 1){
                this.otp.otpgeneration(this.loginForm.value);
              }
              this.router.navigate(['/otp-validation']);
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

  open(template: TemplateRef<any> = this.defaultTemplate) {
		this.modalService.open(template, { ariaLabelledBy: 'modal-basic-title' })
	}
}
