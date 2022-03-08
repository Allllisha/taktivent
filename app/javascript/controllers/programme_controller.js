import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["programme", "programmeStartAt", "nowPlaying"];

  connect() {
    console.log("Hello from programme_controller.js");
    this.programmeStartAt = new Date(this.programmeStartAtTarget.dataset.start);
    setInterval(this.programmeStartContainer.bind(this),1000);
  }

  programmeStartContainer(){
    if(new Date().valueOf() >=  this.programmeStartAt.valueOf()){
     this.programmeTarget.classList.remove('d-none')
    }
  }
  

  programmeEndContainer(event) {
    if(event.key === 'e'){
      this.nowPlayingTarget.classList.add('d-none')
     }
  }
}