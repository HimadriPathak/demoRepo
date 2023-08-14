import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class OtpVerificationService {

  constructor(private http: HttpClient) { }
  public otpgeneration(user: any) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("LoginID",user.username);
    queryParams = queryParams.append("LoginKey",user.password);
    queryParams = queryParams.append("OrgID",10003);

    this.http.get("https://safaikarmachariapi.eaangan.com/api/Login/GetLoginData", {params: queryParams}).subscribe((res) =>{
      // console.log(res)
      localStorage["OTPData"] = JSON.stringify(res);
    },
    (err)=>{
      console.log(err)
    })
  }

}
