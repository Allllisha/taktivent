import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["songTitle", "duration"];

  connect() {
    // this.songInfoStart = new Date(this.element.dataset.start);
    // const minute = this.durationTarget.dataset.time;
    // const milliseconds = parseInt(minute * 60) * 1000;
    // this.endTime = new Date(this.songInfoStart.getTime() + milliseconds);
    // this.interval = setInterval(this.songTimeContainer.bind(this), 1000);
    // // this.changeImages();

  }
  

  songTimeContainer() {
    if (new Date().valueOf() >= this.endTime.valueOf()) {
      this.songTitleTarget.classList.add("d-none");
    }
    else if (new Date().valueOf() >= this.songInfoStart.valueOf()) {
      this.songTitleTarget.classList.remove("d-none");
    }
  }
}