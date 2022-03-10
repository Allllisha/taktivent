import { Controller } from 'stimulus'

export default class extends Controller {
  static targets = ['questionForm', 'choiceField', 'choiceSection' ]

  connect() {
    // console.log('Hello from questions_customization_form_controller.js')
    // console.log(this.testTarget)
  }

  // display appropiate number of questions according to selection
  displayQuestionForms(event) {
    let i = 1;
    this.questionFormTargets.forEach((element) => {
      if ( event.target.value >= i) {
        element.hidden = false;
      } else {
        element.hidden = true;
      }
      i++;
    });
  }

  // display appropiate number of choice entry fields according to selection
  displayChoiceFields(event) {
    let i = 1;
    this.choiceFieldTargets.forEach((element) => {
      if (event.target.dataset.questionNumber === element.dataset.questionNumber) {
        if (event.target.value >= i) {
          element.hidden = false;
        } else {
          element.hidden = true;
        }
        i++;
      }
    });
  }

  // hide choice field if the question type is starts
  // (stars questions choices are always 1-5)
  hideChoiceSectionForStarsQuestion(event) {
    this.choiceSectionTargets.forEach((element) => {
      if (event.target.dataset.questionNumber === element.dataset.questionNumber &&
          event.target.value === "stars") {
        element.hidden = true;
      } else {
        element.hidden = false;
      }
    });
  }
}
