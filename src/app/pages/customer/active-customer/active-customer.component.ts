import { AlertService } from '@/_services/alert.service';
import { CustomerService } from '@/_restapi-services/customer.service';
import { ModalService } from '@/_services/modal.service';
import { ToastrNotifyService } from '@/_services/toastr-notify.service';
import { ExclService } from '@/_services/excl.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AppService } from '@/_services/app.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-active-customer',
  templateUrl: './active-customer.component.html',
  styleUrls: ['./active-customer.component.scss']
})
export class ActiveCustomerComponent implements OnInit {
  @ViewChild('table') table: ElementRef;
  public customerForm: FormGroup;
  public customerData:any=[];
  public dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  dtElement: DataTableDirective;
  isDtInitialized:boolean = false

  constructor(private modalService: ModalService, private toastr:ToastrNotifyService,private alertService: AlertService, public api:CustomerService, public appservice:AppService, public exclservice:ExclService) {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      responsive: true,
    };
  }

  ngOnInit(){
    this.getCustomer();
    this.customerForm = new FormGroup({
      user_id: new FormControl(),
      name: new FormControl(),
      email: new FormControl(),
      phone: new FormControl(),
      gender: new FormControl(),
      state: new FormControl(),
      city: new FormControl(),
      pincode: new FormControl(),
      address: new FormControl(),
      partner_id:new FormControl(null),
      company_name: new FormControl(null),
    })
  }

  getCustomer(){
    if(this.appservice.role == 'partner'){
      this.api.getCustomer(this.appservice.user.company_name).subscribe(response => {
        this.customerData = response.data;
        if (this.isDtInitialized) {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
          });
        } else {
          this.isDtInitialized = true
          this.dtTrigger.next();
        }
      })
    }else{
      this.api.getCustomer('all').subscribe(response => {
        this.customerData = response.data;
        if (this.isDtInitialized) {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
          });
        } else {
          this.isDtInitialized = true
          this.dtTrigger.next();
        }
      })
    }
  }

  openAddCustomerModal(content){
    this.modalService.open(content)
  }

  onSubmit() {
    if(this.customerForm.valid){
      if(this.appservice.role == 'partner'){
        this.customerForm.value.partner_id = this.appservice.user.partner_id;
        this.customerForm.value.company_name = this.appservice.user.company_name;
      }
      this.customerForm.value.user_id = this.api.createCustomerId();
      this.api.postCustomer(this.customerForm.value).subscribe(response => {
        if(response.message){
          this.customerForm.reset();
          this.getCustomer();
          this.modalService.dismissall();
        }
      })
    }
  }

  exportAsXLSX():void {
    this.exclservice.exportAsExcelFile(this.table.nativeElement, 'active customers');
  }
}
