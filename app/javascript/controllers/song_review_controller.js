import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = [ 'song', 'review' ]

  connect() {
    console.log('Hello from song_review_controller.js')
    // console.log(this.testTarget)

    this.songStart = new Date(this.songTarget.dataset.start);
   //  setInterval(this.showSongCountdown,1000);
    setInterval(this.showReview.bind(this),1000);
  }
  Songset2fig(num) {

    var ret;
    if( num < 10 ) { ret = "0" + num; }
    else { ret = num; }
    return ret;
 }
  SongisNumOrZero(num) {
 
    if( isNaN(num) ) { return 0; }
    return num;
 }


 showReview(){
   console.log(this.songStart.valueOf());
   console.log(new Date().valueOf());
   console.log(new Date().valueOf() >=  this.songStart.valueOf());
    if(new Date().valueOf() >=  this.songStart.valueOf()){
     this.reviewTarget.classList.remove('d-none')
     console.log('show');
    }
 }

 showSongCountdown() {
 
    var nowSongDate = new Date();
    var dnumSongNow = nowSongDate.getTime();
  
    var inputSongYear  = document.getElementById("songYear").value;
    var inputSongMonth = document.getElementById("songMonth").value - 1;
    var inputSongDate  = document.getElementById("songDate").value;
    var inputSongHour  = document.getElementById("songHour").value;
    var inputSongMin   = document.getElementById("songMin").value;
    var inputSongSec   = document.getElementById("songSec").value;
    var targetSongDate = new Date( SongisNumOrZero(inputSongYear), SongisNumOrZero(inputSongMonth), SongisNumOrZero(inputSongDate), SongisNumOrZero(inputSongHour), SongisNumOrZero(inputSongMin), SongisNumOrZero(inputSongSec));
    var dnumSongTarget = targetSongDate.getTime();
  
  
    var dlSongYear  = targetSongDate.getFullYear();
    var dlSongMonth = targetSongDate.getMonth() + 1;
    var dlSongDate  = targetSongDate.getDate();
    var dlSongHour  = targetSongDate.getHours();
    var dlSongMin   = targetSongDate.getMinutes();
    var dlSongSec   = targetSongDate.getSeconds();
 
  
   
    var diff2SongDates = dnumSongTarget - dnumSongNow;
    if( dnumSongTarget < dnumSongNow ) {
 
       diff2SongDates *= -1;
    }
  
 
    if( dnumSongTarget > dnumSongNow ) {
        //Before Deadline
     document.getElementById("song").style.display ="none";
    }
    else {
       //After the Deadline
     document.getElementById("song").style.display ="block";
    } 
 
 
 }

}