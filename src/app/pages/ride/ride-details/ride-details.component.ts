import { DriverService } from '@/_restapi-services/driver.service';
import { RideService } from '@/_restapi-services/ride.service';
import { AppService } from '@/_services/app.service';
import { ModalService } from '@/_services/modal.service';
import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
declare let google;

@Component({
  selector: 'app-ride-details',
  templateUrl: './ride-details.component.html',
  styleUrls: ['./ride-details.component.scss']
})
export class RideDetailsComponent implements OnInit {
  // @ViewChild('searchaddress') public searchPickupElementRef: ElementRef;
  ride_id: string;
  status_id: string;
  cancelledstatus:string='8';
  completedstatus:string='7';
  rideData:any=[];
  cancelRideForm: FormGroup;
  completeRideForm: FormGroup;
  driverData: any =[];
  driver_id:string;
  driver_fare:string;
  RideCarImgDocumentForm: FormGroup;
  selectedFiles:any;
  pickupImgList:any=[];
  dropImgList:any=[];
  imageSrc: any;
  reAssignDriverForm: FormGroup;
  getExistingPointForm: FormGroup;
  sendTrailerFareRideForm: FormGroup;
  sendTrailerFareRideApproveForm: FormGroup;
  sendTrailerFareRideRejectForm: FormGroup;
  RideAccidentalImgForm:FormGroup;
  existparkingno:string;
  isExistPartkingDiv:Boolean;
  reassignDataPoint1:any=[];
  reassignDataPoint2:any=[];
  driver_name: any;

  price:any;
  gst:any;
  selectedFiles2: any;
  accidentImgList: any;
  accidentVideoList: any;
  is_advance_pay:string;

  sendRideAccidentImgVideoApproveForm: FormGroup;
  sendRideAccidentImgVideoRejectForm: FormGroup;
  RideAddrChangeForm: FormGroup;
  ngZone: any;
  ridelat: number;
  ridelng: number;
  rideaddress: string;

  constructor(private Actrouter:ActivatedRoute, private rideapi:RideService, private modalService: ModalService, private router:Router, private driverApi:DriverService, public appservice:AppService,private mapsAPILoader: MapsAPILoader) { 
  }

  ngOnInit(): void {
    this.Actrouter.params.subscribe(paramsId => {
      this.ride_id = paramsId.ride_id;
      this.status_id = paramsId.status_id;
    });
    this.cancelRideForm = new FormGroup({
      ride_id: new FormControl(),
      cancelled_reason: new FormControl(),
      status: new FormControl()
    })
    this.completeRideForm = new FormGroup({
      ride_id: new FormControl(),
      feedback: new FormControl(),
      status: new FormControl()
    })
    this.RideCarImgDocumentForm = new FormGroup({
      ride_img: new FormControl(),
      ride_id: new FormControl(),
      ride_type: new FormControl()
    })
    this.reAssignDriverForm = new FormGroup({
      city: new FormControl(),
      time: new FormControl(),
      driver_id: new FormControl(),
      driver_name: new FormControl(),
      exist_parking_no: new FormControl(),
      ride_id: new FormControl(),
      status: new FormControl()
    })
    this.getExistingPointForm = new FormGroup({
      existingpoint: new FormControl('', Validators.required)
    });
    this.sendTrailerFareRideForm = new FormGroup({
      ride_id: new FormControl(),
      price: new FormControl(),
      gst: new FormControl(),
      status: new FormControl()
    })
    this.sendTrailerFareRideApproveForm = new FormGroup({
      ride_id: new FormControl(),
      price: new FormControl(),
      gst: new FormControl(),
      status: new FormControl()
    })
    this.sendTrailerFareRideRejectForm = new FormGroup({
      ride_id: new FormControl(),
      cancelled_reason: new FormControl(),
      status: new FormControl()
    })
    this.sendRideAccidentImgVideoApproveForm = new FormGroup({
      ride_id: new FormControl(),
      accident_status: new FormControl()
    })
    this.sendRideAccidentImgVideoRejectForm = new FormGroup({
      ride_id: new FormControl(),
      accident_remark: new FormControl(),
      accident_status: new FormControl()
    })
    this.RideAccidentalImgForm = new FormGroup({
      ride_accidental_img: new FormControl(),
      ride_accidental_comment: new FormControl(),
      ride_id: new FormControl()
    })
    this.RideAddrChangeForm = new FormGroup({
      address_type: new FormControl('', Validators.required),
      ride_id: new FormControl(),
      address: new FormControl('', Validators.required)
    })
    this.getSingleRide();
    this.getDriver();
    this.getRideCarImgPickupList();
    this.getRideCarImgDropList();
    this.getReassignDataPoint1();
    this.getReassignDataPoint2();
    this.getRideCarAccidentalImg();
    this.getRideCarAccidentalVideo();

    
    //load Places Autocomplete
    // this.mapsAPILoader.load().then(() => {
    //   let autocompletePickup = new google.maps.places.Autocomplete(this.searchPickupElementRef.nativeElement);
    //   autocompletePickup.addListener("place_changed", () => {
    //     this.ngZone.run(() => {
    //       let place: google.maps.places.PlaceResult = autocompletePickup.getPlace();
    //       if (place.geometry === undefined || place.geometry === null) {
    //         return;
    //       }
    //       this.ridelat = place.geometry.location.lat();
    //       this.ridelng = place.geometry.location.lng();
    //       this.rideaddress = place.formatted_address;
    //     });
    //   });
    // });

  }

  getDriver(){
    this.driverApi.getDriver(3).subscribe(response => {
      this.driverData = response.data;
    })
  }

  getSingleRide(){
    this.rideapi.getSingleRide(this.ride_id).subscribe(response => {
      this.rideData.push(response.data);
      this.price = response.data.ride.price;
      this.gst = response.data.ride.gst;
    })
  }

  startride(){
    this.rideapi.rideStatusUpdate({ride_id: this.ride_id, status: 3}).subscribe(response => {
      this.router.navigate(['/ongoing-ride']);
    })
  }

  reachedpickup(){
    this.rideapi.rideStatusUpdate({ride_id: this.ride_id, status: 4}).subscribe(response => {
      this.router.navigate(['/ongoing-ride']);
    })
  }

  reacheddrop(){
    this.rideapi.rideStatusUpdate({ride_id: this.ride_id, status: 5}).subscribe(response => {
      this.router.navigate(['/ongoing-ride']);
    })
  }

  paymentdone(){
    this.rideapi.rideStatusUpdate({ride_id: this.ride_id, status: 6}).subscribe(response => {
      this.router.navigate(['/ongoing-ride']);
    })
  }

  completedride(content){
    this.modalService.open(content)
  }

  completeRideSubmit(){
    this.rideapi.rideStatusUpdate(this.completeRideForm.value).subscribe(response => {
      this.modalService.dismissall();
      this.completeRideForm.reset();
      this.router.navigate(['/completed-ride']);
    })
  }

  cancelledride(content){
    this.modalService.open(content)
  }

  advancepay(){
    this.rideapi.rideStatusUpdate({"ride_id":this.ride_id,"is_advancepay":'1', "price":this.is_advance_pay, "status":'4'}).subscribe(response => {
      this.modalService.dismissall();
      this.router.navigate(['/ongoing-ride']);
    })
  }

  canceladvancepay(){
    this.rideapi.rideStatusUpdate({"ride_id":this.ride_id,"is_advancepay":'0', "cancellation_charge":this.is_advance_pay, "status":'8', "cancelled_reason":'Ride Cancel By Partner After Driver Reached Pickup Localtion'}).subscribe(response => {
      this.modalService.dismissall();
      this.router.navigate(['/cancelled-ride']);
    })
  }

  cancelRideSubmit(){
    this.rideapi.rideStatusUpdate(this.cancelRideForm.value).subscribe(response => {
      this.modalService.dismissall();
      this.cancelRideForm.reset();
      this.router.navigate(['/cancelled-ride']);
    })
  }

  assignDriver(){
    this.rideapi.postAssignRide({driver_id:this.driver_id,driver_fare:this.driver_fare, ride_id:this.ride_id,status:2}).subscribe(response => {
      this.router.navigate(['/scheduled-ride']);
    })
  }

  onFileSelect(event) {
    this.selectedFiles = event.target.files;
  }

  uploadRideImg(status){
    if(this.RideCarImgDocumentForm.valid){
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const formData = new FormData();
        formData.append('ride_img', this.selectedFiles[i]);
        formData.append('ride_id', this.ride_id);
        formData.append('ride_type', status);
        this.rideapi.uploadRideImg(formData).subscribe(response => {
          console.log(response)
        })
      }
    }
  }

  onFileSelect2(event) {
    this.selectedFiles2 = event.target.files;
    console.log(event)
  }

  uploadRideAccidentalImg(){
    if(this.RideAccidentalImgForm.valid){
      for (let i = 0; i < this.selectedFiles2.length; i++) {
        const formData = new FormData();
        formData.append('ride_accidental_img', this.selectedFiles2[i]);
        formData.append('ride_accidental_comment', this.RideAccidentalImgForm.value['ride_accidental_comment']);
        formData.append('ride_id', this.ride_id);
        this.rideapi.uploadRideAccidentImg(formData).subscribe(response => {
          console.log(response)
        })
      }
    }
  }

  getRideCarImgPickupList(){
    this.rideapi.getRideCarImgList(this.ride_id,4).subscribe(response => {
      this.pickupImgList = response.data;
    })
  }

  getRideCarImgDropList(){
    this.rideapi.getRideCarImgList(this.ride_id,5).subscribe(response => {
      this.dropImgList = response.data;
    })
  }

  getRideCarAccidentalImg(){
    this.rideapi.getRideCarAccidentalImgList(this.ride_id,'img').subscribe(response => {
      this.accidentImgList = response.data;
    })
  }

  getRideCarAccidentalVideo(){
    this.rideapi.getRideCarAccidentalImgList(this.ride_id,'video').subscribe(response => {
      this.accidentVideoList = response.data;
    })
  }

  submitExistingPoint(){
    this.isExistPartkingDiv = true;
    this.existparkingno = this.getExistingPointForm.value['existingpoint'];
  }

  getDriverName(e){
    let text = e.target.value;
    let toppingArr = text.split('|');
    this.driver_name = toppingArr[1];
  }

  submitReAssignDriver(){
    this.reAssignDriverForm.value['ride_id'] = this.ride_id;
    this.reAssignDriverForm.value['exist_parking_no'] = this.existparkingno;
    this.reAssignDriverForm.value['driver_name'] = this.driver_name;
    this.rideapi.postReassignData(this.reAssignDriverForm.value).subscribe(response => {
      this.isExistPartkingDiv = false;
      this.getExistingPointForm.reset();
      this.reAssignDriverForm.reset();
    })
  }

  sendTrailerFareRideSubmit(){
    this.sendTrailerFareRideForm.value['ride_id'] = this.ride_id;
    this.sendTrailerFareRideForm.value['status'] = 9;
    this.rideapi.rideStatusUpdate(this.sendTrailerFareRideForm.value).subscribe(response => {
      this.modalService.dismissall();
      this.cancelRideForm.reset();
      this.router.navigate(['/trailer-request-ride']);
    })
  }

  sendTrailerFareRideApproveSubmit(){
    this.sendTrailerFareRideForm.value['ride_id'] = this.ride_id;
    this.sendTrailerFareRideForm.value['status'] = 1;
    this.sendTrailerFareRideForm.value['price'] = this.price;
    this.sendTrailerFareRideForm.value['gst'] = this.gst;
    // console.log(this.sendTrailerFareRideForm.value)
    this.rideapi.rideStatusUpdate(this.sendTrailerFareRideForm.value).subscribe(response => {
      this.modalService.dismissall();
      this.cancelRideForm.reset();
      this.router.navigate(['/scheduled-ride']);
    })
  }

  sendTrailerFareRideRejectSubmit(){
    this.sendTrailerFareRideForm.value['ride_id'] = this.ride_id;
    this.sendTrailerFareRideForm.value['cancelled_reason'] = 'Trailer fare Rejected';
    this.sendTrailerFareRideForm.value['status'] = 8;
    this.sendTrailerFareRideForm.value['price'] = null;
    this.sendTrailerFareRideForm.value['gst'] = null;
    this.rideapi.rideStatusUpdate(this.sendTrailerFareRideForm.value).subscribe(response => {
      this.modalService.dismissall();
      this.cancelRideForm.reset();
      this.router.navigate(['/cancelled-ride']);
    })
  }

  sendRideAccidentImgVideoApproveSubmit(){
    this.sendRideAccidentImgVideoApproveForm.value['ride_id'] = this.ride_id;
    this.sendRideAccidentImgVideoApproveForm.value['accident_status'] = 1;
    this.rideapi.rideStatusUpdate(this.sendRideAccidentImgVideoApproveForm.value).subscribe(response => {
      this.modalService.dismissall();
      this.cancelRideForm.reset();
      this.router.navigate(['/ongoing-ride']);
    })
  }

  sendRideAccidentImgVideoRejectSubmit(){
    this.sendRideAccidentImgVideoRejectForm.value['ride_id'] = this.ride_id;
    this.sendRideAccidentImgVideoRejectForm.value['accident_status'] = 0;
    this.rideapi.rideStatusUpdate(this.sendRideAccidentImgVideoRejectForm.value).subscribe(response => {
      this.modalService.dismissall();
      this.cancelRideForm.reset();
      this.router.navigate(['/ongoing-ride']);
    })
  }

  getReassignDataPoint1(){
    this.rideapi.getReassignData(this.ride_id, "1").subscribe(response => {
      this.reassignDataPoint1 = response.data
    })
  }

  getReassignDataPoint2(){
    this.rideapi.getReassignData(this.ride_id, "2").subscribe(response => {
      this.reassignDataPoint2 = response.data
    })
  }

  openModal(content){
    this.modalService.open(content)
  }

  saveRideAddrChange(){
    if(this.RideAddrChangeForm.valid){
      this.RideAddrChangeForm.value['ride_id'] = this.ride_id;
      this.rideapi.rideAddressUpdate(this.RideAddrChangeForm.value).subscribe(response => {
        this.ngOnInit();
      })
    }else{
      alert("Please Select Address Type And ENter new address")
    }
  }
  
}
