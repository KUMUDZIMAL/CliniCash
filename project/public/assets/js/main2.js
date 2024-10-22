const createUserBtn = document.getElementById("create-user");
const username = document.getElementById("username");
const allusersHtml = document.getElementById("allusers");
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const endCallBtn = document.getElementById("end-call-btn");
const socket = io(); // Initialize socket connection
let localStream;
let caller = [];

// Singleton for PeerConnection
const PeerConnection = (function () {
    let peerConnection;

    const createPeerConnection = () => {
        const config = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        };
        peerConnection = new RTCPeerConnection(config);

        if (localStream) {
            localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream);
            });
        }

        peerConnection.ontrack = (event) => {
            console.log("Remote stream received", event.streams[0]);
            remoteVideo.srcObject = event.streams[0];
        };

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("icecandidate", event.candidate);
            }
        };

        return peerConnection;
    };

    return {
        getInstance: () => {
            if (!peerConnection) {
                peerConnection = createPeerConnection();
            }
            return peerConnection;
        }
    };
})();

// Handle user creation
createUserBtn.addEventListener("click", () => {
    if (username.value !== "") {
        socket.emit("join-user", username.value);
        document.querySelector(".username-input").style.display = 'none';
    }
});

// End call
endCallBtn.addEventListener("click", () => {
    socket.emit("call-ended", caller);
    endCall();
});

// Handle socket events
socket.on("joined", (allusers) => {
    allusersHtml.innerHTML = "";
    for (const user in allusers) {
        const li = document.createElement("li");
        li.textContent = `${user} ${user === username.value ? "(You)" : ""}`;

        if (user !== username.value) {
            const button = document.createElement("button");
            button.classList.add("call-btn");
            button.addEventListener("click", () => startCall(user));
            const img = document.createElement("img");
            img.setAttribute("src", "/images/phone.png");
            img.setAttribute("width", 20);
            button.appendChild(img);
            li.appendChild(button);
        }

        allusersHtml.appendChild(li);
    }
});

socket.on("offer", async ({ from, to, offer }) => {
    const pc = PeerConnection.getInstance();
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit("answer", { from, to, answer: pc.localDescription });
    caller = [from, to];
});

socket.on("answer", async ({ from, to, answer }) => {
    const pc = PeerConnection.getInstance();
    await pc.setRemoteDescription(answer);
    endCallBtn.style.display = 'block';
    caller = [from, to];
});

socket.on("icecandidate", async (candidate) => {
    const pc = PeerConnection.getInstance();
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
});

socket.on("call-ended", () => {
    endCall();
});

// Start the call
const startCall = async (user) => {
    const pc = PeerConnection.getInstance();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("offer", { from: username.value, to: user, offer: pc.localDescription });
};

// End the call
const endCall = () => {
    const pc = PeerConnection.getInstance();
    if (pc) {
        pc.close();
        endCallBtn.style.display = 'none';
        remoteVideo.srcObject = null; // Clear remote video
    }

    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localVideo.srcObject = null; // Clear local video
    }

    // Reset peer connection for future calls
    peerConnection = null;
};

// Initialize local video stream
const startMyVideo = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: { 
                facingMode: "user", // Front camera for mobile
                width: { ideal: 720 }, 
                height: { ideal: 1280 }
            }
        });
        localStream = stream;
        localVideo.srcObject = stream;
    } catch (error) {
        console.error("Error starting video stream:", error);
        alert("Unable to access camera and microphone. Please check your device permissions.");
    }
};

startMyVideo();
