import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = [ 'song', 'review', 'songContainer', 'SongReviewBox' ]



  songHideContainer(event) {
  //  if (event.key === 'e') {
     this.songContainerTarget.classList.add("d-none");
  //  }
 }

 submit(event){
  if (event.submit) {
    event.preventDefault();
    this.songContainerTarget.classList.add("d-none");
  }
 }
} 