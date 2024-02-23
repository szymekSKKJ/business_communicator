"use client";

import { userSmallData } from "@/app/api/user/types";
import styles from "./styles.module.scss";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { socketSignal } from "@/components/WebSocketBackgroundActions/WebSocketBackgroundActions";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

const makeCall = async (
  peerConnection: RTCPeerConnection,
  userId: string,
  currentUserId: string,
  socket: Socket<DefaultEventsMap, DefaultEventsMap>,
  roomId: string
) => {
  await peerConnection.setLocalDescription();

  socket.emit("setLocalDescription", {
    ioId: socket.id,
    localDescription: peerConnection.localDescription,
    toUserId: userId,
    fromUserId: currentUserId,
    roomId: roomId,
  });

  socket.on("setRemoteDescription", async (data: { remoteDescription: RTCSessionDescription; fromUserId: string }) => {
    const { remoteDescription } = data;
    if (remoteDescription.type === "offer") {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(remoteDescription));
      const answerDescription = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answerDescription);

      socket.emit("setLocalDescription", {
        ioId: socket.id,
        localDescription: peerConnection.localDescription,
        toUserId: userId,
        fromUserId: currentUserId,
      });
    }
    if (remoteDescription.type === "answer") {
      const answerDescription = new RTCSessionDescription(remoteDescription);
      await peerConnection.setRemoteDescription(answerDescription);
    }
  });
};

const startVoicePowerCalculation = (stream: MediaStream, userElement: HTMLDivElement) => {
  const audioContext = new AudioContext();

  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 1024;

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const source = audioContext.createMediaStreamSource(stream);
  source.connect(analyser);

  const calculateVoicePower = () => {
    analyser.getByteFrequencyData(dataArray);

    const sum = dataArray.reduce((a, b) => a + b, 0);
    const avg = Math.floor(sum / bufferLength);

    userElement.style.setProperty("--power", `${1}.${avg}`);

    window.requestAnimationFrame(calculateVoicePower);
  };

  const requestAnimationFrameId = window.requestAnimationFrame(calculateVoicePower);

  return requestAnimationFrameId;
};

interface componentProps {
  data: userSmallData;
  currentUserId: string;
  streamLocal: MediaStream;
  roomId: string;
  streamLocalVideo: MediaStream | null;
}

const User = ({ data, currentUserId, streamLocal, roomId, streamLocalVideo }: componentProps) => {
  const componentElementRef = useRef<null | HTMLDivElement>(null);
  const audioElementRef = useRef<null | HTMLAudioElement>(null);
  const videooElementRef = useRef<null | HTMLVideoElement>(null);
  const requestAnimationFrameIdRef = useRef<null | number>(null);

  const [isUserConnected, setIsUserConnected] = useState((currentUserId === data.id) === true ? true : false);
  const [peerConnection] = useState(new RTCPeerConnection(configuration));

  const { id: userId, profileImage, publicId } = data;

  useEffect(() => {
    if (userId !== currentUserId) {
      const sender = peerConnection.addTrack(streamLocal.getAudioTracks()[0], streamLocal);
      const sender1 = peerConnection.addTrack(streamLocal.getVideoTracks()[0], streamLocal);

      return () => {
        peerConnection.removeTrack(sender);
        peerConnection.removeTrack(sender1);
      };
    }
  }, [streamLocal]);

  useEffect(() => {
    if (userId !== currentUserId) {
      const remoteStream = new MediaStream();
      const socket = socketSignal.value!;

      audioElementRef.current!.srcObject = remoteStream;

      peerConnection.addEventListener("track", ({ streams }) => {
        streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);

          if (track.kind === "audio") {
            const requestAnimationFrameId = startVoicePowerCalculation(remoteStream, componentElementRef.current!);
            requestAnimationFrameIdRef.current = requestAnimationFrameId;
          } else {
            videooElementRef.current!.srcObject = remoteStream;
          }
        });
      });

      const icecandidate = (event: RTCPeerConnectionIceEvent) => {
        socket.emit("newCandidate", {
          ioId: socket.id,
          candidate: event.candidate,
          toUserId: userId,
          fromUserId: currentUserId,
          roomId: roomId,
        });
      };

      peerConnection.addEventListener("icecandidate", icecandidate);

      const negotiationneeded = async () => {
        makeCall(peerConnection, userId, currentUserId, socket, roomId);
      };

      peerConnection.addEventListener("negotiationneeded", negotiationneeded);

      const signalingstatechange = (event: Event) => {
        if (peerConnection.signalingState === "stable") {
          setIsUserConnected(true);
        }
      };

      peerConnection.addEventListener("signalingstatechange", signalingstatechange);

      const candidateQueue: RTCIceCandidate[] = [];

      socket.on("setCandidate", (data: { candidate: RTCIceCandidate }) => {
        const { candidate } = data;
        if (peerConnection.remoteDescription === null) {
          candidateQueue.push(candidate);
        } else {
          candidateQueue.forEach((candidateLocal) => {
            peerConnection.addIceCandidate(new RTCIceCandidate(candidateLocal));
          });

          peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      return () => {
        peerConnection.removeEventListener("icecandidate", icecandidate);
        peerConnection.removeEventListener("negotiationneeded", negotiationneeded);
        if (requestAnimationFrameIdRef.current) {
          window.cancelAnimationFrame(requestAnimationFrameIdRef.current);
        }
      };
    } else {
      const requestAnimationFrameId = startVoicePowerCalculation(streamLocal, componentElementRef.current!);

      videooElementRef.current!.srcObject = streamLocal;

      return () => {
        window.cancelAnimationFrame(requestAnimationFrameId);
      };
    }
  }, []);

  return (
    <div className={`${styles.user} ${isUserConnected === false ? styles.notConnected : ""}`} ref={componentElementRef}>
      <audio ref={audioElementRef} autoPlay muted={false}></audio>
      <video ref={videooElementRef} autoPlay muted={true} width={1280} height={720}></video>
      <div className={`${styles.outsideImageWrapper}`}>
        <div className={`${styles.imageWrapper}`}>
          <Image src={profileImage} alt={"Zdjęcie użytkownika"} width={256} height={256}></Image>
        </div>
        <div className={`${styles.voiceRange}`}></div>
      </div>
    </div>
  );
};

export default User;
