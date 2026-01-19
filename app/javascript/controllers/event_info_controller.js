import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = [ 'event', 'info', 'eventBox', 'eventAbout', 'about']

  connect() {
    // console.log(this.testTarget)

    this.eventStart = new Date(this.eventTarget.dataset.start);
    this.about = new Date(this.aboutTarget.dataset.about);
    console.log(this.about)
  //   this.eventEnd = new Date(this.infoTarget.dataset.end);
  //  //  setInterval(this.showSongCountdown,1000);
   setInterval(this.EventAboutContainer.bind(this),1000);
    setInterval(this.EventStartContainer.bind(this),1000);
  }


 EventStartContainer(){
    if(new Date().valueOf() >=  this.eventStart.valueOf()){
     this.eventBoxTarget.classList.add('d-none')
    }
  }

  EventAboutContainer(){
    if(new Date().valueOf() >=  this.about.valueOf()){
      this.eventAboutTarget.classList.add('d-none')
     }
  }


 eventInfoContainer(event){
  //  console.log(this.eventStart.valueOf());
  //  console.log(new Date().valueOf());
  //  console.log(new Date().valueOf() >=  this.eventStart.valueOf());
    if(event.key === 'e'){
     this.eventBoxTarget.classList.remove('d-none')
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
   if(event.key === 'e'){
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