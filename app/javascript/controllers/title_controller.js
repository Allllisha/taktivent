import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["songTimeStart",  "songTimeEnd", "eventTitle"]

  connect() {
    console.log('Hello from title_controller.js')
    this.songTimeStart = new Date(this.songTimeStartTarget.dataset.song);
    this.songTimeEnd = new Date(this.songTimeEndTarget.dataset.end);

    setInterval(this.songTimeContainer.bind(this),1000);
    setInterval(this. songTimeEndContainer.bind(this),1000);
  }

  songTimeContainer(){
    if(new Date().valueOf() >=  this.songTimeStart.valueOf()){
      this.eventTitleTarget.classList.add('d-none');
      // this.eventTitleTarget.classList.add('d-none');
   }
 }

 songTimeEndContainer(){
  if(new Date().valueOf() >=  this.songTimeEnd.valueOf()){
    this.eventTitleTarget.classList.remove('d-none');
    // this.eventTitleTarget.classList.add('d-none');
 }
}

}