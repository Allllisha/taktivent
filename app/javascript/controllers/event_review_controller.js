import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["eventReview", "eventEndAt"];

  eventReviewContainer(event) {
    if(event.key === 'e'){
      this.eventReviewTarget.classList.remove('d-none')
     }
  }
}