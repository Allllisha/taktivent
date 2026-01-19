import { Controller } from 'stimulus'

export default class extends Controller {
  static targets = ['questionForm', 'choiceField', 'choiceSection' ]

  // connect() {
  //   console.log('Hello from questions_customization_form_controller.js')
  //   console.log(this.testTarget)
  // }

  // display correct number of questions according to user's choice
  displayQuestionForms(event) {
    // loop through all question customization input fields
    // display the input field if its index does not exceed the desired number of questions
    this.questionFormTargets.forEach((element, index) => {
      if ( event.target.value >= index + 1) { // starts from 1 instead of 0
        element.hidden = false;
      } else {
        element.hidden = true;
      }
    });
  }

  // display correct number of choice input fields according to user's choice
  displayChoiceFields(event) {
    // loop through all choice input fields of that questions
    // display the input field if its index does not exceed the desired number of questions
    this.choiceFieldTargets.forEach((element, index) => {
      if (event.target.dataset.questionNumber === element.dataset.questionNumber) {
        if (event.target.value >= index + 1) { // starts from 1 instead of 0
          element.hidden = false;
        } else {
          element.hidden = true;
        }
      }
    });
  }

  // hide choice input field if the question type is stars
  // (stars questions choices are always 1-5)
  hideChoiceSectionForStarsQuestion(event) {
    this.choiceSectionTargets.forEach((element) => {
      // only display or hide the input field if it and the question type selection field have the same question number
      if (event.target.dataset.questionNumber === element.dataset.questionNumber) {
        if (event.target.value === "stars") {
          element.hidden = true;
        } else {
          element.hidden = false;
        }
      }
    });
  }
}
