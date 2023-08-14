import { Component, OnInit, ViewChild,TemplateRef } from '@angular/core';
import { OtpVerificationService } from 'src/app/services/otp-verification.service';
import { CountdownComponent, CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-otp-validation',
  templateUrl: './otp-validation.component.html',
  styleUrls: ['./otp-validation.component.css']
})
export class OtpValidationComponent {
  
  userDetails: any;
  config: CountdownConfig = { leftTime: 10, format: 'mm:ss' };
  notify = '';
  incorrectOTP = false;
  otpValue: String;
  timer = false;
  @ViewChild('cd') private countdown: CountdownComponent;
  @ViewChild('default') defaultTemplate!: TemplateRef<any>;
  alertMessage = '';
  otpForm!: FormGroup;

  constructor(private modalService: NgbModal, private otp: OtpVerificationService, private router: Router, private fb: FormBuilder){
    this.otpForm = this.fb.group({
      otp: ['', Validators.required]
    })
  }
  
  ngOnInit(){
    console.log(this.countdown);
    this.userDetails = JSON.parse(localStorage["UserDetails"]);
  }
  
  handleEvent(e: CountdownEvent) {
    this.notify = e.action.toUpperCase();
    if (e.action === 'notify') {
      this.notify += ` - ${e.left} ms`;
    }
    if (e.left == 0){
      this.timer = true;
    }
  }

  onSubmit(){
    if(this.otpForm.valid){
      this.otpValue = String(JSON.parse(localStorage["OTPData"]).Data.Table[0].OtpCD);
      if(this.otpForm.value.otp == this.otpValue){
        this.router.navigate(['/home']);
      }else{
        this.otpForm.reset();
        this.alertMessage = "Wrong OTP!!";
        this.open(this.defaultTemplate)
      }
    }else{
      this.validateAllFormFields(this.otpForm);
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

  resend(){
    this.timer = false;
    this.countdown.restart();
    this.otp.otpgeneration(this.userDetails);
  }

    
  open(template: TemplateRef<any> = this.defaultTemplate) {
    this.modalService.open(template, { ariaLabelledBy: 'modal-basic-title' })
  }

}



