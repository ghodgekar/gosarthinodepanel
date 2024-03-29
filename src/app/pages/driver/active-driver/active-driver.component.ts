import { DriverService } from '@/_restapi-services/driver.service';
import { ExclService } from '@/_services/excl.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-active-driver',
  templateUrl: './active-driver.component.html',
  styleUrls: ['./active-driver.component.scss']
})
export class ActiveDriverComponent implements OnInit {
  @ViewChild('table') table: ElementRef;
  public dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  driverData: any;

  constructor(private api:DriverService, private router:Router, public exclservice:ExclService) { }

  ngOnInit(): void {
    this.getDriver(3);
  }  
  
  getDriver(statusid){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      responsive: true,
    };
    this.api.getDriver(statusid).subscribe(response => {
      this.driverData = response.data;
      this.dtTrigger.next();
    })
  }

  openDriverDetailsPage(driver_id){
    this.router.navigate(['/driver-details',driver_id]);
  }

  exportAsXLSX():void {
    this.exclservice.exportAsExcelFile(this.table.nativeElement, 'active rides');
  }

}
