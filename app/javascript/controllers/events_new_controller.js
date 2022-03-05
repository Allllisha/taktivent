import { Controller } from 'stimulus'

export default class extends Controller {
  static targets = ['eventImageInput', 'eventImage', 'eventBackground' ]

  connect() {
  }

  displayUploadedImage() {
    this.eventBackgroundTarget.style.display = "none";
    // const image = event.target.files[0];
    // console.log(image.size);
    const reader = new FileReader();
    const eventImage = this.eventImageTarget;
    reader.onload = function (file) {
      const img = new Image();
      // console.log(file);
      img.src = file.target.result;
      eventImage.appendChild(img);
    }
    reader.readAsDataURL(event.target.files[0]);
    // console.log(files);
  }
}
