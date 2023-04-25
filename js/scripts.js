// глобальные переменные
let width = 500,
    height = 0,
    filter= 'none',
    streaming = false,
    videoStream = null,
    position = 0;

const startButton = document.getElementById('startButton');
const endButton = document.getElementById('endButton');

const video = document.getElementById('video');
const photo = document.getElementById('photo');
const photoButton = document.getElementById('photoButton');
const clearButton = document.getElementById('clearButton');
const photoFilter = document.getElementById('photoFilter');

const faceButton = document.getElementById('faceButton');
const recoButton = document.getElementById('recoButton');

// const zoomIner = document.getElementById('zoomIner');


Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
]).then(startVideo)


async function startVideo(){
  startButton.addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({video : true}, {audio : false}
      )
      .then(function(stream) {
        videoStream = stream;

        video.srcObject = stream
      })
      .catch(function(err){
        console.log(`Error:${err}`)
      })
})
}

endButton.addEventListener('click', () => {
  if (videoStream) {
    const tracks = videoStream.getTracks();
    tracks.forEach(track => track.stop());
    videoStream = null;
  }
})

video.addEventListener('canplay', () =>{
  if(!streaming){

    height = video.videoHeight / (video.videoWidth / width);

    video.setAttribute('width', width);
    video.setAttribute('height', height);
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    streaming = true;
  }
},false)


photoButton.addEventListener('click', (e) => {
  takePhoto()

  e.preventDefault()
},false)

/////Сдвиг

// function zoomIn() {
//   zoomIner.addEventListener('click', () => {
//     const zoomFactor = 1.1; // Увеличение на 10%
//     context.drawImage(video, 0, 0, myCanvas.width * zoomFactor, myCanvas.height * zoomFactor);
// })
// }


function takePhoto(){
  //
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if(width && height){
    canvas.width = width
    canvas.height = height

    context.drawImage(video, 0, 0, width, height);

    const imgUrl = canvas.toDataURL('image/png')

    const img = document.createElement('img')

    img.setAttribute('src',imgUrl)

    img.style.filter = filter;

    photo.appendChild(img)

    canvas.style.display = "none"
  }
}

// Вибір фільтру 
photoFilter.addEventListener('change', (e) =>{
  filter = e.target.value;

  video.style.filter = filter

  e.preventDefault()
})

// кнопка очистити
clearButton.addEventListener('click', () =>{
  // очистит фото 
  photo.innerHTML = '';
  // Обнулити фільтри
  filter = 'none'; // оригінал відео
  video.style.filter = filter; //обнулити відео фільтр
  photoFilter.selectedIndex = 0 // обнулити список вибору
})

faceButton.addEventListener('click', () => {
  if (!streaming) { // перевіряємо виконинується чи код 
    streaming = true; // встановлюємо зміну true якщо так

    const canvas = faceapi.createCanvasFromMedia(video) //код створює новий елемент canvas
    document.body.append(canvas) //  додаємо створений canvas до тіла HTML-документу
    const displaySize = { width: video.width, height: video.height } // встановлюємо зміні розміру
    faceapi.matchDimensions(canvas, displaySize) // цей код викликає функцію з бібліотеки face-api.js, щоб забезпечити збіг розмірів канваса з екраном
    const intervalId = setInterval(async () => {  // створення змінної intervalId, яка зберігає ID інтервалу
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions() // виявляє всі обличчя на відео з використанням нейронних мереж
      const resizedDetections = faceapi.resizeResults(detections, displaySize) //  змінює розмір виявлених облич на відповідний розмір екрана
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)  // очищає канвас для кожного кадру
      faceapi.draw.drawDetections(canvas, resizedDetections) // код малює на канвасі прямокутники навколо виявлених облич
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections) // код малює на канвасі ознаки (очі, ніс, рот і т.д.) для кожного обличчя
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections) // код малює на канвасі настрої для кожного обличчя 
    }, 100)

    // зупиняє код після повторного натискання 
    faceButton.addEventListener('click', () => {
      clearInterval(intervalId); // очищення інтервалу
      canvas.remove(); // видаляємо canvas з сторінки
      streaming = false; // встановлюємо змінну false
    }, { once: true }); // тільки один раз виконується подія
  }
});
