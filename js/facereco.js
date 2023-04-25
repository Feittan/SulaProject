// const video = document.getElementById('video');

// const recoButton = document.getElementById('recoButton');

// function getLabeles() {
//     const labels = ["Ivan"];
//     return Promise.all(
//       labels.map(async (label) => {
//         const descriptions = [];
//         for (let i = 1; i <= 2; i++) {
//           const img = await faceapi.fetchImage(`./labels/${label}/${i}.jpg`);
//           const detections = await faceapi
//             .detectSingleFace(img)
//             .withFaceLandmarks()
//             .withFaceDescriptor();
//           descriptions.push(detections.descriptor);
//         }
//         return new faceapi.LabeledFaceDescriptors(label, descriptions);
//       })
//     );
//   }
  
//   async function faceRecognition() {
//     const labeledFaceDescriptors = await getLabeles();
//     const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);
//       console.log("yea")
//       video.addEventListener("playing", () => {
//       location.reload();
//     });
  
//       const canvas = faceapi.createCanvasFromMedia(video);
//       document.body.append(canvas);
  
//       const displaySize = { width: video.width, height: video.height };
//       faceapi.matchDimensions(canvas, displaySize);
  
//       setInterval(async () => {
//         const detections = await faceapi
//           .detectAllFaces(video)
//           .withFaceLandmarks()
//           .withFaceDescriptors();
  
//         const resizedDetections = faceapi.resizeResults(detections, displaySize);
  
//         canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  
//         const results = resizedDetections.map((d) => {
//           return faceMatcher.findBestMatch(d.descriptor);
//         });
//         results.forEach((result, i) => {
//           const box = resizedDetections[i].detection.box;
//           const drawBox = new faceapi.draw.DrawBox(box, {
//             label: result,
//           });
//           drawBox.draw(canvas);
//         });
//       }, 100);
//   }
  