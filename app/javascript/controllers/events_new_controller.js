import { Controller } from 'stimulus'

export default class extends Controller {
  static targets = [ 'eventImage', 'eventBackground' ]

  // connect() {
  // }

  displayUploadedImage() {
    this.eventBackgroundTarget.style.display = "none";
    const reader = new FileReader();
    const eventImage = this.eventImageTarget;
    reader.onload = function (file) {
      const img = new Image();
      img.src = file.target.result;
      eventImage.appendChild(img);
    }
    reader.readAsDataURL(event.target.files[0]);
  }
}
