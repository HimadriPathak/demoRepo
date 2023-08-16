import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import data from '../../assets/json/data.json';


@Injectable({
  providedIn: 'root'
})
export class OtpVerificationService {
  orgData = data;

  constructor(private http: HttpClient) { }
  public otpgeneration(user: any) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("LoginID",user.username);
    queryParams = queryParams.append("LoginKey",user.password);
    queryParams = queryParams.append("OrgID",this.orgData['orgID']);

    this.http.get("https://safaikarmachariapi.eaangan.com/api/Login/GetLoginData", {params: queryParams}).subscribe((res) =>{
      // console.log(res)
      localStorage["OTPData"] = JSON.stringify(res);
    },
    (err)=>{
      console.log(err)
    })
  }

}
