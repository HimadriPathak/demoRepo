import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from '../home/home.component';


@Component({
  selector: 'app-modal-box',
  templateUrl: './modal-box.component.html',
  styleUrls: ['./modal-box.component.css']
})
export class ModalBoxComponent {
  exit = "Yes";
  closeResult = '';
  @Input() buttonValue = "";
  constructor(private modalService: NgbModal, private homecomponent: HomeComponent){ }
  @ViewChild('default', { static: true }) defaultTemplate!: TemplateRef<any>;
  message = 'Do you want to exit application?';
  open(template: TemplateRef<any> = this.defaultTemplate) {
    if(this.buttonValue != "Exit"){
      this.message = "Current Data will be lost Do you want to change"
    }
		this.modalService.open(template, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        console.log(template);
        this.closeResult = `Closed with: ${result}`;
        console.log(this.closeResult);
        if (this.buttonValue == "Exit"){
          this.homecomponent.appExit()
        }
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        console.log(this.closeResult);
			},
		);
	}
  private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}
}
