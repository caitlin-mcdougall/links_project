async function _getLocalVideo(){
    var video = document.getElementById("localVideo")

    var constraints = {
      audio: false,
      video: {
       facingMode: "user"
      }
    };
    console.log("before streaming")
    /* Stream it to video element */
    navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
      console.log("should be streaming");
      video.srcObject = stream;
    });

}

var getLocalVideo = LINKS.kify(_getLocalVideo);