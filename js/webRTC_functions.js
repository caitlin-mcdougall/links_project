var peerConnectionConfig = {
    'iceServers': [
      {'urls': 'stun:stun.stunprotocol.org:3478'},
      {'urls': 'stun:stun.l.google.com:19302'},
      {'urls': 'stun:stun.services.mozilla.com'}
    ]
};

peerConnections = {}

async function getLocalVideo(){
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
    await navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
      console.log("should be streaming");
      video.srcObject = stream;
    });

}

function _setupRTCConnection(pid){
    console.log("setting up RTC Connection");
    connection = new RTCPeerConnection(peerConnectionConfig);
    connection.onicecandidate = newIceCandidate;
    connection.onaddstream = newRemoteStream;
    // getLocalVideo();
    var localvideo = document.getElementById("localVideo");
    console.log(localvideo.srcObject)
    connection.addStream(localvideo.srcObject);
    peerConnection = {
        connection: connection,
        iceCandidates: peerConnectionConfig.iceServers
    };
    peerConnections[pid] = peerConnection;
}

function newIceCandidate(event){
    // if(event.candidate){
    //     peerConnections[pid].iceCandidates.push(event.candidate)
    // };
}

function newRemoteStream(event){
    if(!event){
        return null
    }
    else{
        console.log("event = ", event.stream);
        remotevideo = document.getElementById("remoteVideo");
        remotevideo.srcObject = event.stream;
        console.log(event.stream);
    }
    return
}

function _getCandidates(pid){
    return peerConnections[pid].iceCandidates;
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
var getCandidates = LINKS.kify(_getCandidates);
var createOfferSDP = LINKS.kify(_createOfferSDP);
var getOfferSDP = LINKS.kify(_getOfferSDP);
var isLocalSDP = LINKS.kify(_isLocalSDP);
var isRemoteSDP = LINKS.kify(_isRemoteSDP);
var createAnswerSDP = LINKS.kify(_createAnswerSDP);
var receiveOfferSDP = LINKS.kify(_receiveOfferSDP);
// var getLocalVideo = LINKS.kify(_getLocalVideo);