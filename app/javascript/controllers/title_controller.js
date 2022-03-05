import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["songTimeStart",  "songTimeEnd", "eventTitle"]

  connect() {
    this.songTimeEnd = new Date(this.songTimeEndTarget.dataset.end);

    setInterval(this. songTimeEndContainer.bind(this),1000);
  }

  songTimeContainer(event){
    if(event.key === 'i'){
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