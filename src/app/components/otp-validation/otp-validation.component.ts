import { Component, OnInit, ViewChild,TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { OtpVerificationService } from 'src/app/services/otp-verification.service';
import { CountdownComponent, CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgOtpInputModule } from 'ng-otp-input';

@Component({
  selector: 'app-otp-validation',
  templateUrl: './otp-validation.component.html',
  styleUrls: ['./otp-validation.component.css']
})

export class OtpValidationComponent {

  // user details to resend sms
  userDetails = JSON.parse(localStorage["UserDetails"]);
  loginDetails = JSON.parse(localStorage['UserLoginData']).Table[0];

  incorrectOTP = false;
  otpValue: String;
  timer = true;

  // represents the components in html
  @ViewChild('cd') countdown: CountdownComponent;
  @ViewChild('default') defaultTemplate!: TemplateRef<any>;
  @ViewChild('otpInput') ngOtpInput : NgOtpInputModule;

  // configuration of counter and input field
  configcd: CountdownConfig = { leftTime: 10, format: 'mm:ss' };
  config = { allowNumbersOnly: true, length: 6, isPasswordInput: false, disableAutoFocus: false };

  constructor(private modalService: NgbModal, private otp: OtpVerificationService, private router: Router){ }
  
  // when clock turn 0 resend button appear
  clockCounter(e: CountdownEvent) {
    if (e.left == 0){
      this.timer = false;
    }
  }

  // when clicked on resend button otp-generation service will be called and user will get another message
  resend(){
    this.timer = true;
    this.otp.otpgeneration(this.userDetails);
    this.countdown.restart();
  }

  // otp validation when clicked on submit/continue
  onSubmit(otpInput: any = ''){
    // if pressed on continue it will send the user to home page
    if(this.loginDetails.IsOTPSend != 1){
      this.router.navigate(['/home'], { replaceUrl: true });
      return
    }
    // if otp is required and pressed on submit matching the otp
    else if(otpInput.currentVal){
      this.incorrectOTP = false;
      this.otpValue = String(JSON.parse(localStorage["OTPData"]).Data.Table[0].OtpCD);
      // if otp is correctly entered send the user to home page else open a message box 
      if(otpInput.currentVal == this.otpValue){
        this.router.navigate(['/home'], { replaceUrl: true });
      }else{
        this.open(this.defaultTemplate);
      }
      // if otp field is empty show otp required message
    }else{
      this.incorrectOTP = true
    }
  }

  open(template: TemplateRef<any> = this.defaultTemplate) {
    this.modalService.open(template, { ariaLabelledBy: 'modal-basic-title' })
  }

}



