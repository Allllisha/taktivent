import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["songImg", "length"];

  connect() {
    console.log("Hello from song_image_controller.js");
    this.songInfoStart = new Date(this.element.dataset.start);
    const minute = this.lengthTarget.dataset.time;
    const milliseconds = parseInt(minute * 60) * 1000;
    this.endTime = new Date(this.songInfoStart.getTime() + milliseconds / 60);
    // console.log(this.songInfoStart, this.endTime);
    // this.interval = setInterval(this.songImgContainer.bind(this), 1000);
    // this.changeImages();
  }


  showImageContainer(){
    if(new Date().valueOf() >=  this.songStart.valueOf()){
     this.songBoxTarget.classList.remove('d-none')
    }
  }

  songImgContainer() {
    if (new Date().valueOf() >= this.endTime.valueOf()) {
      // console.log("finished")
      this.songImgTarget.classList.add("d-none");
    }
    else if (new Date().valueOf() >= this.songInfoStart.valueOf()) {
      // console.log("ongoing")
      this.songImgTarget.classList.remove("d-none");
    }
  }

}