<template>
  <div class="h-screen w-screen bg-black text-white flex flex-col">
    <!-- Grade de vídeos -->
    <div class="flex-1 grid auto-rows-fr gap-2 p-4"
         :class="`grid-cols-${getGridColumns}`">
      
      <!-- Vídeo local -->
      <div class="relative bg-gray-900 rounded-lg overflow-hidden shadow-md flex flex-col">
        <video
          ref="localVideo"
          autoplay
          playsinline
          muted
          class="w-full h-full object-cover flex-1"
        ></video>
        <!-- Nome -->
        <div class="absolute bottom-0 left-0 right-0 bg-black/60 text-center py-1 text-sm">
          {{ userStore.username || psychologistStore.username }}
        </div>
      </div>

      <!-- Participantes -->
      <div v-for="p in participants" :key="p.connectionId"
           class="relative bg-gray-900 rounded-lg overflow-hidden shadow-md flex flex-col">
        <video
          :ref="setRemoteVideoRef(p.connectionId)"
          autoplay
          playsinline
          class="w-full h-full object-cover flex-1"
        ></video>
        <!-- Nome -->
        <div class="absolute bottom-0 left-0 right-0 bg-black/60 text-center py-1 text-sm">
          {{ p.name }}
        </div>
      </div>
    </div>

    <!-- Barra de controles -->
    <div class="bg-gray-900/90 p-3 flex justify-center gap-6 border-t border-gray-800">
      <button @click="toggleMic"
              class="p-3 rounded-full transition"
              :class="micEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-500'">
        <span v-if="micEnabled">🎤</span>
        <span v-else>🔇</span>
      </button>

      <button @click="toggleCamera"
              class="p-3 rounded-full transition"
              :class="cameraEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-500'">
        <span v-if="cameraEnabled">📷</span>
        <span v-else>🚫</span>
      </button>

      <button @click="joinCall"
              class="p-3 rounded-full bg-green-600 hover:bg-green-500 transition">
        ✅
      </button>

      <button class="p-3 rounded-full bg-red-600 hover:bg-red-500 transition">
        📞
      </button>
    </div>
  </div>
</template>


<script setup lang="ts">
import * as signalR from "@microsoft/signalr";
import { ref, reactive } from "vue";
import { useUserStore } from "~/stores/user";
import { usePsychologistStore } from "~/stores/psychologist"

definePageMeta({ layout: false });

const psychologistStore = usePsychologistStore()
console.log(psychologistStore)
const userStore = useUserStore();
const localVideo = ref<HTMLVideoElement | null>(null);
const localStream = ref<MediaStream | null>(null);

const participants = ref<any[]>([]);
const peerConnections: Record<string, RTCPeerConnection> = {};
const remoteVideoRefs: Record<string, HTMLVideoElement> = {};

let connection: signalR.HubConnection | null = null;

const cameraEnabled = ref(true);
const micEnabled = ref(true);

function setRemoteVideoRef(id: string) {
  return (el: HTMLVideoElement) => {
    if (el) remoteVideoRefs[id] = el;
  };
}
const getGridColumns = computed(() => {
  const total = participants.value.length + 1; // inclui você
  if (total <= 1) return 1;
  if (total === 2) return 2;
  if (total <= 4) return 2;
  if (total <= 6) return 3;
  if (total <= 9) return 3;
  return 4; // ajustável
});
async function joinCall() {
  if (connection) return;

  // captura local
  localStream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  if (localVideo.value) {
    localVideo.value.srcObject = localStream.value;
  }

  connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5257/videoCallHub", {
      accessTokenFactory: () => localStorage.getItem("access_token") ?? ""
    })
    .withAutomaticReconnect()
    .build();

  // participante entrou
  connection.on("UserJoined", async (user) => {
    console.log(`${user.name} entrou`);
    participants.value.push(user);
    await createOffer(user.connectionId);
  });

  // participante saiu
  connection.on("UserLeft", (user) => {
    console.log(`${user.name} saiu`);
    participants.value = participants.value.filter(p => p.connectionId !== user.connectionId);
    if (peerConnections[user.connectionId]) {
      peerConnections[user.connectionId].close();
      delete peerConnections[user.connectionId];
    }
  });

  // lista inicial
  connection.on("UpdateParticipants", (users) => {
    participants.value = users.filter(u => u.connectionId !== connection?.connectionId);
  });

  // Recebe oferta
  connection.on("ReceiveOffer", async (fromId, offer) => {
    await handleOffer(fromId, JSON.parse(offer));
  });

  // Recebe resposta
  connection.on("ReceiveAnswer", async (fromId, answer) => {
    await peerConnections[fromId].setRemoteDescription(new RTCSessionDescription(JSON.parse(answer)));
  });

  // Recebe ICE
  connection.on("ReceiveIceCandidate", async (fromId, candidate) => {
    if (peerConnections[fromId]) {
      await peerConnections[fromId].addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
    }
  });

  await connection.start();
 await connection.invoke(
  "JoinCall",
  userStore.username || psychologistStore.username
);
}

// cria conexão e envia oferta
async function createOffer(toId: string) {
  const pc = createPeerConnection(toId);
  peerConnections[toId] = pc;

  // adiciona tracks
  localStream.value?.getTracks().forEach(track => pc.addTrack(track, localStream.value!));

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  await connection?.invoke("SendOffer", toId, JSON.stringify(offer));
}

async function handleOffer(fromId: string, offer: RTCSessionDescriptionInit) {
  const pc = createPeerConnection(fromId);
  peerConnections[fromId] = pc;

  localStream.value?.getTracks().forEach(track => pc.addTrack(track, localStream.value!));

  await pc.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  await connection?.invoke("SendAnswer", fromId, JSON.stringify(answer));
}

function createPeerConnection(id: string) {
  const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });

  pc.ontrack = (event) => {
     
    if (remoteVideoRefs[id]) {
      remoteVideoRefs[id].srcObject = event.streams[0];
    }
  };

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      connection?.invoke("SendIceCandidate", id, JSON.stringify(event.candidate));
    }
  };

  return pc;
}

// controles locais
function toggleCamera() {
  const track = localStream.value?.getVideoTracks()[0];
  if (track) {
    track.enabled = !track.enabled;
    cameraEnabled.value = track.enabled;
  }
}
function toggleMic() {
  const track = localStream.value?.getAudioTracks()[0];
  if (track) {
    track.enabled = !track.enabled;
    micEnabled.value = track.enabled;
  }
}
</script> 