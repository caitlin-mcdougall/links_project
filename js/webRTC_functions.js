var peerConnectionConfig = {
    'iceServers': [
      {'urls': 'stun:stun.stunprotocol.org:3478'},
      {'urls': 'stun:stun.l.google.com:19302'},
      {'urls': 'stun:stun.services.mozilla.com'}
    ]
};

peerConnections = {}

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
      localStream = new MediaStream()
      localStream.addTrack(stream.getVideoTracks()[0])
      console.log(stream.getVideoTracks())
      video.srcObject = localStream;
      console.log("should be streaming");
      videoStream = true;
    });

}

function _isLocalVideo(){
  return videoStream
}


function _setupRTCConnection(pid){
    console.log("setting up RTC Connection");
    connection = new RTCPeerConnection(peerConnectionConfig);
    connection.onicecandidate = event => newIceCandidate(event, pid);
    connection.ontrack = newRemoteTrack;
    // getLocalVideo();
    var localvideo = document.getElementById("localVideo");
    console.log(localvideo.srcObject)
    connection.addStream(localvideo.srcObject);
    peerConnection = {
        connection: connection,
        iceCandidates: peerConnectionConfig.iceServers,
        isNewIceCandidate: false
    };
    peerConnections[pid] = peerConnection;
}

function newIceCandidate(event, pid){
    if(event.candidate != null){
        // console.log(event.candidate)
        peerConnections[pid].iceCandidates.push(event.candidate);
        peerConnections[pid].isNewIceCandidate = true;
    };
}

function _getIsNewIceCandidate(pid){
    isCandidate = peerConnections[pid].isNewIceCandidate;
    return isCandidate;
}

function newRemoteTrack(event){
    if(!event){
        return null
    }
    else{
        console.log("event = ", event);
        remotevideo = document.getElementById("remoteVideo");
        remoteStream = new MediaStream();
        remoteStream.addTrack(event.track);
        console.log(remoteStream)
        newVid = document.createElement("video")
        newVid.setAttribute('object-fit', 'cover');
        newVid.setAttribute('width', '320px');
        newVid.setAttribute('height', '240px');
        newVid.setAttribute("autoplay", "true")
        newVid.srcObject = event.streams[0];
        remoteVideo.appendChild(newVid)
        console.log(event.streams);
    }
    return
}

function _getNewIceCandidates(pid){
    candidates = peerConnections[pid].iceCandidates.pop(0);
    return candidates;
}

function _addNewIceCandidates(pid, candidate){
    console.log(candidate)
    iceCandidate = new RTCIceCandidate(candidate)
    console.log(peerConnections[pid])
    peerConnections[pid].connection.addIceCandidate(iceCandidate)
}

function _createOfferSDP(pid){
    peerConnections[pid].connection.createOffer( 
        {'OfferToReceiveAudio': true, 'OfferToReceiveVideo': true }
        ).then( function (offer){
            peerConnections[pid].connection.setLocalDescription(offer)}
        );
}

function _getOfferSDP(pid){
    return peerConnections[pid].connection.localDescription;
}

function _isLocalSDP(pid){
    return !(!peerConnections[pid].connection.localDescription);
}
function _isRemoteSDP(pid){
    return !(!peerConnections[pid].connection.remoteDescription);
}

function _receiveOfferSDP(pid, offer){
    console.log(pid);
    console.log(Object.keys(peerConnections))
    if (offer.type == "offer"){
        peerConnections[pid].connection.setRemoteDescription(new RTCSessionDescription(offer));
    }
    else{
        peerConnections[pid].connection.setRemoteDescription(new RTCSessionDescription(offer));
    }
}

function _createAnswerSDP(pid){
    peerConnections[pid].connection.createAnswer(
        { 'OfferToReceiveAudio': true, 'OfferToReceiveVideo': true }
        ).then( function (sessionDescription) {
        peerConnections[pid].connection.setLocalDescription(sessionDescription);  
    });
}



var setupRTCConnection = LINKS.kify(_setupRTCConnection);
var getNewIceCandidates = LINKS.kify(_getNewIceCandidates);
var createOfferSDP = LINKS.kify(_createOfferSDP);
var getOfferSDP = LINKS.kify(_getOfferSDP);
var isLocalSDP = LINKS.kify(_isLocalSDP);
var isRemoteSDP = LINKS.kify(_isRemoteSDP);
var createAnswerSDP = LINKS.kify(_createAnswerSDP);
var receiveOfferSDP = LINKS.kify(_receiveOfferSDP);
var getLocalVideo = LINKS.kify(_getLocalVideo);
var isLocalVideo = LINKS.kify(_isLocalVideo);
var getIsNewIceCandidate = LINKS.kify(_getIsNewIceCandidate);
var addNewIceCandidates = LINKS.kify(_addNewIceCandidates);