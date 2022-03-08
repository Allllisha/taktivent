import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["songImage", "length"];


  // showImageContainer(){
  //   if(new Date().valueOf() >=  this.songStart.valueOf()){
  //    this.songBoxTarget.classList.remove('d-none')
  //   }
  // }

  songImgContainer(event) {
    if (event.key === 'e') {
      // console.log("finished")
      this.songImageTarget.classList.add("d-none");
    }
  }

}