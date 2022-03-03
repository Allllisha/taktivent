import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = [ 'event', 'eventBox', 'eventAbout' ]

  connect() {
    console.log('Hello from event_info_controller.js')
    // console.log(this.testTarget)

    this.eventStart = new Date(this.eventTarget.dataset.start);
    
   //  setInterval(this.showSongCountdown,1000);
  //  console.log(this.eventStart);
    setInterval(this.eventInfoContainer.bind(this),1000);
    setInterval(this.eventAboutContainer.bind(this),1000);
  }

 eventInfoContainer(){
  //  console.log(this.eventStart.valueOf());
  //  console.log(new Date().valueOf());
  //  console.log(new Date().valueOf() >=  this.eventStart.valueOf());
    if(new Date().valueOf() >=  this.eventStart.valueOf()){
     this.eventBoxTarget.classList.add('d-none')
    }
 }


 eventAboutContainer(){
  // console.log(this.eventStart.valueOf());
  // console.log(new Date().valueOf());
  // console.log(new Date().valueOf() >=  this.eventStart.valueOf());
   if(new Date().valueOf() >=  this.eventStart.valueOf()){
    this.eventAboutTarget.classList.add('d-none')
   }
}


}