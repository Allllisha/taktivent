import { Controller } from 'stimulus'

export default class extends Controller {
  static targets = ['existingPerformer', 'newPerformer' ]

  // connect() {
  //   console.log('Hello from performer_new_controller.js')
  //   console.log(this.testTarget)
  // }

  changePerformerForm(event) {
    // display "choose an exisiting performer" form or "create a new performer" form according to user's choice
    if (event.target.value === "existing") {
      this.existingPerformerTarget.hidden = false;
      // disabled fields do not send data when the form is submitted
      this.existingPerformerTarget.disabled = false;
      this.newPerformerTarget.hidden = true;
      this.newPerformerTarget.disabled = true;
    } else {
      this.existingPerformerTarget.hidden = true;
      this.existingPerformerTarget.disabled = true;
      this.newPerformerTarget.hidden = false;
      this.newPerformerTarget.hidden = false;
    }
  }
}
