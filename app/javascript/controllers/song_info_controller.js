import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets =  ['songInfoStart', 'songInfoEnd', 'eventImg']

  connect() {
    console.log('Hello from song_info_controller.js')
    this.songInfoStart = new Date(this.songInfoStartTarget.dataset.start);
    this.songInfoEnd = new Date(this.songInfoEndTarget.dataset.end);
    setInterval(this.songImgContainer.bind(this),1000);
    setInterval(this.songImgEndContainer.bind(this),1000);
  }



  songImgContainer(){
     if(new Date().valueOf() >=  this.songInfoStart.valueOf()){
      this.eventImgTarget.classList.add('d-none')
     }
   }


  songImgEndContainer(){
    if(new Date().valueOf() >=  this.songInfoEnd.valueOf()){
     this.eventImgTarget.classList.remove('d-none')
    }
  }
}