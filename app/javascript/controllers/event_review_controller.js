import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["eventReview", "eventEndAt"];

  connect() {
    console.log("Hello from event_review_controller.js");
    this.eventEndAt = new Date(this.eventEndAtTarget.dataset.end);
    setInterval(this.eventReviewContainer.bind(this),1000);
  }

  eventReviewContainer() {
    if(new Date().valueOf() >=  this.eventEndAt.valueOf()){
      this.eventReviewTarget.classList.remove('d-none')
     }
  }
}