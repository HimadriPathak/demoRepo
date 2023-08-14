import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class MarkAttendanceService {

  constructor(private http: HttpClient) { }

  public markAttendance(siward:any,wardNo:any,shift:any, data:any, totaldata: any){
    if (!data){
      return NaN;
    }
    let PresentEmpList: any = []
    let AbsentEmpList: any = []
    let queryParams: any = {}
    let previousPresent: any = []
    let markedByData = JSON.parse(localStorage["UserLoginData"]);

    queryParams["OrgID"] = markedByData.Table[0].OrgID;
    queryParams["CircleNo"] = markedByData.Table[0].CircleNo;
    queryParams["WardNo"] = wardNo;
    queryParams["ShiftID"] = shift ? 1 : 2;
    previousPresent = JSON.parse(JSON.stringify(Array.from(totaldata)));
    PresentEmpList = JSON.parse(JSON.stringify(Array.from(data)));
    AbsentEmpList = JSON.parse(JSON.stringify(Array.from(data)));
    PresentEmpList = PresentEmpList.filter(function( emp ) {
      return emp.IsPresent != true;
    });
    AbsentEmpList = AbsentEmpList.filter(function( emp ) {
      return emp.IsPresent == true;
    });
    previousPresent = previousPresent.filter(function(el) {
      return !AbsentEmpList.includes(el);
    });
    PresentEmpList.push(...previousPresent);
    PresentEmpList.forEach((emp:any) =>{
      if(emp['IsPresent'] == false)
      delete emp['EmployeeName'];
      delete emp['IsPresent'];
      emp.MarkedBy = markedByData.Table[0].UserID;
      JSON.stringify(emp);
    })
    AbsentEmpList.forEach((emp:any) =>{
      if(emp['IsPresent'] == false)
      delete emp['EmployeeName'];
      delete emp['IsPresent'];
      emp.MarkedBy = markedByData.Table[0].UserID;
      JSON.stringify(emp);
    })
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
    };
    if(AbsentEmpList.length != 0){
      queryParams["PresentEmpList"] = AbsentEmpList;
      if(PresentEmpList.length != 0){
        this.http.post("https://safaikarmachariapi.eaangan.com/api/Login/EmpAttendanceAbsenceList", JSON.stringify(queryParams), httpOptions).subscribe(
        (data: any) => {
          // console.log(data)
        },
        (err : any) => {
          alert("Data Not Found");
          console.log(err)
        }
      );
      }
      else{
        return this.http.post("https://safaikarmachariapi.eaangan.com/api/Login/EmpAttendanceAbsenceList", JSON.stringify(queryParams), httpOptions)
      }
    }
    if(PresentEmpList.length != 0){
      queryParams["PresentEmpList"] = PresentEmpList;
      return this.http.post("https://safaikarmachariapi.eaangan.com/api/Login/EmpAttendanceList", JSON.stringify(queryParams), httpOptions)
    }
    return 0;
  }
}
