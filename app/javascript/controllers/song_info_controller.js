import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = [ 'songInfoStart',  'eventInfoStart', 'eventImg', 'songImg', 'eventName', 'songName']

  connect() {
    console.log('Hello from song_info_controller.js')
    // console.log(this.testTarget)
   
    this.eventInfoStart = new Date(this.eventInfoStartTarget.dataset.event);
    this.songInfoStart = new Date(this.songInfoStartTarget.dataset.start);
    this.eventName = this.eventNameTarget.innerText
    this.songName = this.songInfoStartTarget.dataset.song;
    console.log(this.eventName)
    console.log(this.songName )
    setInterval(this.eventImgContainer.bind(this),1000);
  }


  eventImgContainer(){
    console.log(this.eventInfoStart.valueOf());
    console.log(new Date().valueOf());
    console.log(new Date().valueOf() >=  this.eventInfoStart.valueOf());
     if(new Date().valueOf() >=  this.eventInfoStart.valueOf()){
      this.eventImgTarget.classList.add('d-none')
     }
  }


 songImgContainer(){
  console.log(this.songInfoStart.valueOf());
  console.log(new Date().valueOf());
  console.log(new Date().valueOf() >=  this.songInfoStart.valueOf());
   if(new Date().valueOf() >=  this.songInfoStart.valueOf()){
    this.songImgTarget.classList.remove('d-none')
   }
}

}