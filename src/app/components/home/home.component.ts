import { Component, OnInit, Input, OnChanges,TemplateRef,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GetEmpListService } from 'src/app/services/get-emp-list.service';
import { EmpListComponent } from '../emp-list/emp-list.component';
import { SharingService } from 'src/app/services/sharing.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppServiceService } from 'src/app/services/app-service.service';



const CACHE_KEY = "UserLoginData";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @ViewChild('default') defaultTemplate!: TemplateRef<any>;
  buttonValue = "Exit";
  update = 0;
  selectedList = new Set();
  alertMessage = "Current Data will be lost! Do you want to change the Shift?";
  shiftSelected: boolean = true;
  previousShift: boolean = true;
  OrgID: any;
  currDate:string = '';
  circleNo:any;
  wardNo:any;
  morningTime: string ='';
  eveningTime: string ='';
  name: string ='';
  data: any;
  selected: any;
  wards:number[] = [];
  empData: any;
  isLoading: Boolean = false;
  constructor(private appService: AppServiceService,private modalService: NgbModal, private router: Router, private emplist: GetEmpListService, private shareData: SharingService){}

    ngOnInit(){
    this.data = JSON.parse(localStorage[CACHE_KEY] || undefined);
    this.circleNo = this.data.Table[0].CircleNo;
    this.currDate = this.data.Table[0].CurrentDate;
    this.wardNo = this.data.Table[0].WardNo;
    this.name = this.data.Table[0].UserName;
    this.OrgID = this.data.Table[0].OrgID;
    this.morningTime = this.data.Table[0].MorningFrom + " To " + this.data.Table[0].MorningTo;
    this.eveningTime = this.data.Table[0].EveningFrom + " To " + this.data.Table[0].EveningTo;
    localStorage["shiftSelected"] = this.shiftSelected;
    localStorage["listselected"] = 0;

    if(this.wardNo == 0){
      for(let i = 0; i < this.data.Table1.length; i++){
        this.wards.push(this.data.Table1[i].WardNo);
      }
      // this.circleNo = this.data.Table1[0].CircleNo;
      // this.data.Table[0].CircleNo = this.data.Table1[0].CircleNo;
      // localStorage[CACHE_KEY] = JSON.stringify(this.data);
    }else{
      this.selected = this.wardNo;
      this.callemplist();
    }
    
  }
  open(template: TemplateRef<any> = this.defaultTemplate) {
		this.modalService.open(template, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
      this.previousShift = this.shiftSelected;
      this.changeRoute();
			},
			(reason) => {
        this.shiftSelected = this.previousShift;
			},
		);
	}
  changeRoute(){
    this.isLoading = true;
    this.update ++;
    this.emplist.getEmpList({
      'circleNo' : this.circleNo,
      'wardNo' : this.selected,
      'shiftID' : this.shiftSelected ? 1:2
    }).subscribe(
      (data: any) => {
        this.empData = data;
        setTimeout(() => {
          this.isLoading= false;
          this.empData.Data.forEach((emp: any) => {
            delete emp['Msg'];
            delete emp['Result'];
            delete emp['LeaveInd'];
            emp.OrgID = this.OrgID;
            emp.CircleNo = this.circleNo;
            emp.WardNo = this.selected;
            emp.ShiftID = this.shiftSelected ? 1:2;
          });
          this.update++;
          this.shareData.setData(this.empData);
        }, 1000);
      },
      (err : any) => {
      alert("Data Not Found");
      }
    );
  }
  callemplist(){
    if(!this.selected){
      this.previousShift = this.shiftSelected;
      return
    }
    else if(this.selectedList.size != 0){
      this.open();
    }else{
      this.changeRoute();

    }
  }
  updateWardNo(e:any){
    this.selected = e.target.value;
    this.callemplist();
  }

  appExit() {
    localStorage.clear();
    this.shareData.setData(undefined);
    if (this.data.Table[0].IsOTPSend == 1){
      history.go(-2);
    }else{
      history.go(-1);
    }
    this.appService.closeApp();
  }
}
