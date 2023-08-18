import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class OtpVerificationService {
  
  constructor(private http: HttpClient) { }
  // http request to send message to user
  public otpgeneration(user: any) {
    let queryParams = new HttpParams();
    let orgData = JSON.parse(localStorage['UserLoginData']).Table[0];
    // setting http query parameters
    queryParams = queryParams.append("LoginID",user.username);
    queryParams = queryParams.append("LoginKey",user.password);
    queryParams = queryParams.append("OrgID",orgData.OrgID);

    this.http.get("https://safaikarmachariapi.eaangan.com/api/Login/GetLoginData", {params: queryParams}).subscribe((res) =>{
      // the result is stored in local storage
      localStorage["OTPData"] = JSON.stringify(res);
    },
    (err)=>{
      console.log(err)
    })
  }

}
