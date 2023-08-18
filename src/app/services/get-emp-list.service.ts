import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GetEmpListService {
  // data from json
  orgData = JSON.parse(localStorage['UserLoginData']).Table[0];
  constructor(private http: HttpClient) {}
  
  // getting employee list with http request
  public getEmpList(info:any){
    let queryParams = new HttpParams();
    queryParams = queryParams.append("Ind",2);
    queryParams = queryParams.append("OrgID",this.orgData.OrgID);
    queryParams = queryParams.append("CircleNo",info.circleNo);
    queryParams = queryParams.append("WardNo",info.wardNo);
    queryParams = queryParams.append("ShiftID",info.shiftID);
    console.log(queryParams);
    // setting header format to raw
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded'}),
    };

    return this.http.post("https://safaikarmachariapi.eaangan.com/api/Login/EmpList?", queryParams.toString(), httpOptions)
  }
}
