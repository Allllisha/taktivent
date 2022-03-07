import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = [ 'songImg', 'songTitle', 'songBox', 
                   'eventImg', 'eventTitle', 'programme', 
                   'SongReviewBox', 'eventBox', 'eventAbout',
                    "eventReview", "eventEndAt", "playing", "upNext"]

  connect() {
    console.log('Hello from time_faker_controller.js')
    this.counter = 0
    document.addEventListener("keyup",(event) => {
     if(event.key === "k"){
       if(this.counter !== 0){
        this.songImgTargets[this.counter -1].classList.add('d-none');
        this.songTitleTargets[this.counter -1].classList.add('d-none');
        this.songBoxTargets[this.counter -1].classList.add('d-none');
        this.SongReviewBoxTargets[this.counter -1].classList.add('d-none');
        this.playingTargets[this.counter -1].classList.add('d-none');
        this.upNextTargets[this.counter -1].classList.add('d-none');
       }else {
         this.eventImgTarget.classList.add('d-none');
         this.eventTitleTarget.classList.add('d-none');
         this.eventBoxTarget.classList.add('d-none');
         this.eventAboutTarget.classList.add('d-none');
         this.programmeTarget.classList.remove('d-none');
       }
      this.songImgTargets[this.counter].classList.remove('d-none');
      this.songTitleTargets[this.counter].classList.remove('d-none');
      this.songBoxTargets[this.counter].classList.remove('d-none');
      this.SongReviewBoxTargets[this.counter].classList.remove('d-none');
      this.playingTargets[this.counter].classList.remove('d-none');
      this.upNextTargets[this.counter].classList.add('d-none');
      this.counter += 1 
     }
    }) 

  }
  eventReviewContainer(event) {
    if(event.key === 'e'){
      this.eventReviewTarget.classList.remove('d-none')
     }
  }

}