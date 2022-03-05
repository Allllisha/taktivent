import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = [ 'event', 'info', 'eventBox', 'eventAbout' ]

  connect() {
    // console.log(this.testTarget)

  //   this.eventStart = new Date(this.eventTarget.dataset.start);
  //   this.eventEnd = new Date(this.infoTarget.dataset.end);
  //  //  setInterval(this.showSongCountdown,1000);
  //   setInterval(this.eventEndContainer.bind(this),1000);
  //   setInterval(this.eventAboutEndContainer.bind(this),1000);
  }

 eventInfoContainer(event){
  //  console.log(this.eventStart.valueOf());
  //  console.log(new Date().valueOf());
  //  console.log(new Date().valueOf() >=  this.eventStart.valueOf());
    if(event.key === 'v'){
     this.eventBoxTarget.classList.add('d-none')
    }
 }

 eventEndContainer(){
  //  console.log(this.eventStart.valueOf());
  //  console.log(new Date().valueOf());
  //  console.log(new Date().valueOf() >=  this.eventStart.valueOf());
    if(new Date().valueOf() >=  this.eventEnd.valueOf()){
      this.eventBoxTarget.classList.remove('d-none')
    }
 }


 eventAboutContainer(event){
  // console.log(this.eventStart.valueOf());
  // console.log(new Date().valueOf());
  // console.log(new Date().valueOf() >=  this.eventStart.valueOf());
   if(event.key === 'v'){
    this.eventAboutTarget.classList.add('d-none')
   }else if(new Date().valueOf() >=  this.eventEnd.valueOf()){
    this.eventAboutTarget.classList.remove('d-none')
   }
}


eventAboutEndContainer(){
  // console.log(this.eventStart.valueOf());
  // console.log(new Date().valueOf());
  // console.log(new Date().valueOf() >=  this.eventStart.valueOf());
   if(new Date().valueOf() >=  this.eventEnd.valueOf()){
    this.eventAboutTarget.classList.remove('d-none')
   }
}

}