import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["programme", "programmeStartAt"];

  connect() {
    console.log("Hello from programme_controller.js");
    this.programmeStartAt = new Date(this.programmeStartAtTarget.dataset.start);
    setInterval(this.programmeContainer.bind(this),1000);
  }
  

  programmeContainer(event) {
    if(event.key === 'v'){
      this.programmeTarget.classList.remove('d-none')
     }
  }
}