import { Component, Input, OnChanges,TemplateRef,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MarkAttendanceService } from 'src/app/services/mark-attendance.service';
import { SharingService } from 'src/app/services/sharing.service';


@Component({
  selector: 'app-emp-list',
  templateUrl: './emp-list.component.html',
  styleUrls: ['./emp-list.component.css']
})

export class EmpListComponent {
  constructor(private modalService: NgbModal, private shareData: SharingService, private markEmployeeAttendance : MarkAttendanceService, private router: Router){}
  @ViewChild('default') defaultTemplate!: TemplateRef<any>;
  closeResult = '';
  alertMessage = '';
  showAlert: boolean = false;
  employees: any;
  @Input() wardNo:any;
  @Input() selected:any;
  @Input() update = 0;
  @Input() shiftSelected: any;
  @Input() selectedList: any;
  selectedIndexes: number[] = [];
  present:Boolean;
  data:any;
  ngOnChanges() {
    this.employees = this.shareData.getData();
    this.employees = this.employees.Data;
    this.selectedIndexes = [];
    this.selectedList.clear();
    // this.present = false;
    // console.log(this.wardNo)
    if(this.wardNo != 0){
      this.present = this.employees.some(employee => employee['IsPresent'] == true);
    }
  }

  updateSelectedList(emp:any){
    if(this.present){
      return
    }
    localStorage["listselected"] = 1;
    if(this.selectedList.has(emp)){
      this.selectedList.delete(emp);
    }
    else{
      this.selectedList.add(emp);
    }
    if(this.selectedList.size == 0){
      this.update = 0;
      localStorage["listselected"] = 0;
    }
  }

  onRowClick(index: number) {
    if(this.present){
      return
    }
    const selectedIndex = this.selectedIndexes.indexOf(index);
    if (selectedIndex > -1) {
      this.selectedIndexes.splice(selectedIndex, 1);
    } else {
      this.selectedIndexes.push(index);
    }
  }

  isRowSelected(index: number): boolean {
    return this.selectedIndexes.indexOf(index) > -1;
  }


  open(template: TemplateRef<any> = this.defaultTemplate) {
		this.modalService.open(template, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.changeRoute()
			},
			(reason) => {
        this.changeRoute()
			},
		);
	}
  changeRoute(){
    this.shareData.setData(undefined);
    this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
      this.router.navigate(['/home'])})
  }


  submit(){
    this.data = this.markEmployeeAttendance.markAttendance(this.wardNo,this.selected,this.shiftSelected,this.selectedList, this.employees)
    this.data.subscribe(
          (data: any) => {
            // console.log(data);
            setTimeout(() => {
              this.alertMessage = data.Message + "!!   Sending Back to Home Page";
              this.open();
            }, 10);
          },
          (err : any) => {
            alert("Data Not Found");
            console.log(err)
          }
        );
  }
}
