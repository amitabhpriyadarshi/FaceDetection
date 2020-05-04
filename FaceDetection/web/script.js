/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const video = document.getElementById('video')
///getting error model is not loading.
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),//detect eyes nose etc
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),//
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),///happy sad
  faceapi.nets.ageGenderNet.loadFromUri('/models')//age gender

]).then(startVideo())


function startVideo() {
  navigator.mediaDevices.getUserMedia(
    { video: true }
  ).then(
  stream => video.srcObject = stream,
    err => console.error(err)
            )
}


video.addEventListener('playing', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})