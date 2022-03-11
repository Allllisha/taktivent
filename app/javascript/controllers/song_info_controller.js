import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets =  ['songInfoStart', 'songInfoEnd', 'eventImg', 'eventInfoStart', ]

  // connect() {
  //   // this.welcomeStart = new Date(this.welcomeStartTarget.dataset.start);
  //   // this.eventStart = new Date(this.eventInfoStartTarget.dataset.event);
  //   // this.songStart = new Date(this.songInfoStartTarget.dataset.song);
  //   // // setInterval(this.EventStartContainer.bind(this),1000);
  //   // // setInterval(this.welcomeImgContainer.bind(this),1000);
  //   // setInterval(this.welcomeEndContainer.bind(this),1000);
  // }
  
  // // welcomeImgContainer(){
  // //   if(new Date().valueOf() <= this.welcomeStart.valueOf()){
  // //     this.welcomeImgTarget.classList.add('d-none')
  // //    }
  // // }


  // // EventStartContainer(){
  // //   if(new Date().valueOf() >=  this.eventStart.valueOf()){
  // //     this.eventImgTarget.classList.add('d-none')
  // //    }
  // //  }


  //  welcomeEndContainer(){
  //   if(new Date().valueOf() >= this.songStart.valueOf()){
  //     this.welcomeImgTarget.classList.add('d-none')
  //    }
  //  }


  songImgEndContainer(event){
    // if(event.key === 'e'){
     this.eventImgTarget.classList.remove('d-none')
    // }
  }
}