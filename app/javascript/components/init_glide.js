import "@glidejs/glide/src/assets/sass/glide.core";
import "@glidejs/glide/src/assets/sass/glide.theme";
import Glide from '@glidejs/glide'

const initGlide = () => {
  var sliders = document.querySelectorAll('.glide');
  for (var i = 0; i < sliders.length; i++) {
    var glide = new Glide(sliders[i], {
      type: 'slider',
      gap: 30,
      perView: 3,
      peek: -window.innerWidth*0.55,
      startAt: 0,
      focusAt: 'center'
    });
    glide.mount()
  }
}

export {initGlide};
