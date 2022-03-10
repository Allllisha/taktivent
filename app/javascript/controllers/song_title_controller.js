import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["songTitle", "duration"];

 
  songTimeContainer(event) {
    if (event.key === 'e') {
      this.songTitleTarget.classList.add("d-none");
    }
  }
}