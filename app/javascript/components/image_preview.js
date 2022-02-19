const initImagePreview = ( ) => { 
  const picture = document.querySelector('#pictureInput');
  if (picture) {
   
    picture.addEventListener('change', (event) => {
      const files = event.target.files;
      const image = files[0]
      // here's the file size
      console.log(image.size);
      const reader = new FileReader();
      reader.onload = function(file) {
        const img = new Image();
        console.log(file);
        img.src = file.target.result;
        const pictureTarget = document.querySelector('#pictureTarget');
        pictureTarget.appendChild(img);
      }
      reader.readAsDataURL(image);
      console.log(files);
    });
  }
 }

 export {initImagePreview}