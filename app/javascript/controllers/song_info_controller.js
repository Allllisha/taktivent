import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets =  ['eventInfoStart', 'songInfoStart', 'eventImg']

  connect() {
    console.log('Hello from song_info_controller.js')
    // console.log(this.testTarget)
    this.songInfoStart = new Date(this.songInfoStartTarget.dataset.start);
    // this.eventInfoStart = new Date(this.eventInfoStartTarget.dataset.event);
    setInterval(this.songImgContainer.bind(this),1000);
    // setInterval(this.eventImgContainer.bind(this),1000);
  }



  songImgContainer(){
    // console.log(this.eventInfoStart.valueOf());
    // console.log(new Date().valueOf());
    // console.log(new Date().valueOf() >=  this.eventInfoStart.valueOf());
     if(new Date().valueOf() >=  this.songInfoStart.valueOf()){
      this.eventImgTarget.classList.add('d-none')
     }
  }

  // eventImgContainer(){
  //   // console.log(this.eventInfoStart.valueOf());
  //   // console.log(new Date().valueOf());
  //   // console.log(new Date().valueOf() >=  this.eventInfoStart.valueOf());
  //    if(new Date().valueOf() >=  this.eventInfoStart.valueOf()){
      
  //    }
  // }


}