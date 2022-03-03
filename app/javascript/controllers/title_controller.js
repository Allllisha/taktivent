import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["songName", "song", "eventTimeStart", "eventStart", "songInfoStart", 'eventTitle' ]

  connect() {
    console.log('Hello from title_controller.js')
    // this.eventTimeStart = new Date(this.eventTimeStartTarget.dataset.eventTime);
    this.songInfoStart = new Date(this.songInfoStartTarget.dataset.start);
    // console.log(this.songNameTarget.id)
    // console.log(this.songTargets)
    // When the page loads, this ChangeSong method runs
    setInterval(this.songTimeContainer.bind(this),1000);
    // setInterval(this.eventTimeContainer.bind(this),1000);
    this.changeSong();
  }

  songTimeContainer(){
    if(new Date().valueOf() >=  this.songInfoStart.valueOf()){
      this.eventStartTarget.classList.remove('d-none');
      this.eventTitleTarget.classList.add('d-none');
    }
 }


  // eventTimeContainer(){
  //     if(new Date().valueOf() >=  this.eventTimeStart.valueOf()){
  //       this.eventStartTarget.classList.remove('d-none');
  //     }
  //  }


  changeSong() {
    console.log("Next song!")
    // counter is on the div's id. Everytime this runs, it targets the Title's ID and grabs it as the counter
    let counter = this.songNameTarget.id
    // Duration of the song is on the div as well. Put it into the div as a time dataset when you iterate on the show page.
    const seconds = this.songTargets[counter].dataset.time
    // converting the seconds into an Integer and making it milliseconds
    const milliseconds = parseInt(seconds * 60) * 1000
    // changing the title to the next song target. We use the counter as the number to access the array (=songTargets)
    this.songNameTarget.innerText = this.songTargets[counter].innerText
    // Increment the id on the title so next time this code runs, we get the next item on the setlist.
    this.songNameTarget.id = parseInt(counter) + 1
    //setting an interval. the interval is the milliseconds we set.
    setTimeout(() => { this.changeSong() }, milliseconds);
  }
}