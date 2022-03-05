import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets =  ['songInfoStart', 'songInfoEnd', 'eventImg']


  songImgContainer(event){
     if(event.key === 'i'){
      this.eventImgTarget.classList.add('d-none')
     }
   }


  songImgEndContainer(event){
    if(event.key === 'e'){
     this.eventImgTarget.classList.remove('d-none')
    }
  }
}