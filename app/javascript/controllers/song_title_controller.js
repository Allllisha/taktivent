import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["songTitle", "duration"];

  connect() {
    this.songInfoStart = new Date(this.element.dataset.start);
    const minute = this.durationTarget.dataset.time;
    const milliseconds = parseInt(minute * 60) * 1000;
    this.endTime = new Date(this.songInfoStart.getTime() + milliseconds);
    console.log(this.songInfoStart, this.endTime);
    this.interval = setInterval(this.songTimeContainer.bind(this), 1000);
    // this.changeImages();

  }
  

  songTimeContainer() {
    if (new Date().valueOf() >= this.endTime.valueOf()) {
      console.log("finished")
      this.songTitleTarget.classList.add("d-none");
    }
    else if (new Date().valueOf() >= this.songInfoStart.valueOf()) {
      console.log("ongoing")
      this.songTitleTarget.classList.remove("d-none");
    }
  }
}