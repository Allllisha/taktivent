import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = [ 'songImg', 'length' ]

  connect() {
    console.log('Hello from song_image_controller.js')
  
  //  this.eventNameTarget.innerText = this.songInfoStartTarget.dataset.song
    // this.eventInfoStart = new Date(this.eventInfoStartTarget.dataset.event);
    this.songInfoStart = new Date(this.element.dataset.start);
    console.log(this.songInfoStart);
    // setInterval(this.EventImgContainer.bind(this),1000);
    this.interval = setInterval(this.songImgContainer.bind(this),1000);
    // this.changeImages();
  }

  // EventImgContainer(){
  //   // console.log(this.songInfoStart.valueOf());
  //   // console.log(new Date().valueOf());
  //   // console.log(new Date().valueOf() >=  this.songInfoStart.valueOf());
  //    if(new Date().valueOf() >=  this.eventInfoStart.valueOf()){
  //     this.eventStartImgTarget.classList.add('d-none'); 
  //    }
  // }


 songImgContainer(){
  // console.log(this.songInfoStart.valueOf());
  // console.log(new Date().valueOf());
  // console.log(new Date().valueOf() >=  this.songInfoStart.valueOf())
  const minute = this.lengthTarget.dataset.time
  const milliseconds = parseInt(minute * 60) * 1000 * 60
  const endTime = this.songInfoStart;
  endTime.setMilliseconds(endTime.getMilliseconds() + milliseconds);
  console.log(endTime);
  console.log(new Date());
   if(new Date().valueOf() >=  this.songInfoStart.valueOf()){
    this.songImgTarget.classList.remove('d-none')
   } else if(new Date().valueOf() >= endTime.valueOf()){
      this.songImgTarget.classList.add('d-none')
   
   }
}

}