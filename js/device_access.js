var videoStream = false;

function _getLocalVideo(){
    var video = document.getElementById("localVideo")

    var constraints = {
      audio: true,
      video: true
      // video: {
      //  facingMode: "user"
      // }
    };
    console.log("before streaming")
    /* Stream it to video element */
    navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
      video.srcObject = stream;
      console.log("should be streaming");
      videoStream = true;
    });

}

function _isLocalVideo(){
  return videoStream
}

var getLocalVideo = LINKS.kify(_getLocalVideo);
var isLocalVideo = LINKS.kify(_isLocalVideo);