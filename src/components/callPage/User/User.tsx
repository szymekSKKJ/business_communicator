"use client";

import { userSmallData } from "@/app/api/user/types";
import styles from "./styles.module.scss";
import Image from "next/image";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { socketSignal } from "@/components/WebSocketBackgroundActions/WebSocketBackgroundActions";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  bufferedLatency: 50,
  iceCandidatePoolSize: 10,
  audio: true,
  video: true,
  audioCodec: "opus",
  videoCodec: "VP8",
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

    // Poprawić

    //console.log(stream.getAudioTracks()[0].enabled);

    if (stream.getAudioTracks()[0].enabled === false) {
      userElement.style.setProperty("--power", `${1}`);
    } else {
      userElement.style.setProperty("--power", `${1}.${avg}`);
    }

    window.requestAnimationFrame(calculateVoicePower);
  };

  const requestAnimationFrameId = window.requestAnimationFrame(calculateVoicePower);

  return requestAnimationFrameId;
};

interface componentProps {
  data: userSmallData;
  currentUserId: string;
  streamLocal: {
    audio: MediaStream;
    video: MediaStream;
  };
  roomId: string;
  isLocalVideoStreamOn: boolean;
}

const User = ({ data, currentUserId, streamLocal, roomId, isLocalVideoStreamOn }: componentProps) => {
  const componentElementRef = useRef<null | HTMLDivElement>(null);
  const audioElementRef = useRef<null | HTMLAudioElement>(null);
  const videooElementRef = useRef<null | HTMLVideoElement>(null);
  const requestAnimationFrameIdRef = useRef<null | number>(null);
  const chatForVideoStateRef = useRef<null | RTCDataChannel>(null);

  const [isUserConnected, setIsUserConnected] = useState((currentUserId === data.id) === true ? true : false);
  const [peerConnection] = useState(new RTCPeerConnection(configuration));
  const [isRemoteVideoStreamOn, setIsRemoteVideoStreamOn] = useState(false);

  const { id: userId, profileImage, publicId } = data;

  useEffect(() => {
    if (userId !== currentUserId) {
      if (chatForVideoStateRef.current && chatForVideoStateRef.current.readyState === "open") {
        chatForVideoStateRef.current.send(`${isLocalVideoStreamOn}`);
      }
    }
  }, [isLocalVideoStreamOn]);

  useEffect(() => {
    if (userId !== currentUserId) {
      const sender = peerConnection.addTrack(streamLocal.audio.getAudioTracks()[0], streamLocal.audio);
      const sender1 = peerConnection.addTrack(streamLocal.video.getVideoTracks()[0], streamLocal.audio);

      return () => {
        peerConnection.removeTrack(sender);
        peerConnection.removeTrack(sender1);
      };
    }
  }, [streamLocal]);

  useEffect(() => {
    const timeout = setTimeout(() => {
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

        chatForVideoStateRef.current = peerConnection.createDataChannel("chat");

        const message = (event: MessageEvent<any>) => {
          setIsRemoteVideoStreamOn(() => (event.data === "true" ? true : false));
        };

        chatForVideoStateRef.current.addEventListener("message", message);

        const datachannel = (event: RTCDataChannelEvent) => {
          chatForVideoStateRef.current = event.channel;
        };

        peerConnection.addEventListener("datachannel", datachannel);

        makeCall(peerConnection, userId, currentUserId, socket, roomId);

        const signalingstatechange = () => {
          if (peerConnection.signalingState === "stable") {
            setIsUserConnected(true);
          }
        };

        peerConnection.addEventListener("signalingstatechange", signalingstatechange);

        const candidateQueue: RTCIceCandidate[] = [];

        socket.on("setCandidate", (data: { candidate: RTCIceCandidate }) => {
          const { candidate } = data;

          if (candidate === null) {
            socketSignal.value!.emit("webRtcConnected", {
              fromUserId: currentUserId,
              toUserId: userId,
            });
          }

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
          peerConnection.removeEventListener("datachannel", datachannel);
          peerConnection.removeEventListener("signalingstatechange", signalingstatechange);

          if (chatForVideoStateRef.current) {
            chatForVideoStateRef.current.removeEventListener("message", message);
          }

          if (requestAnimationFrameIdRef.current) {
            window.cancelAnimationFrame(requestAnimationFrameIdRef.current);
          }
        };
      } else {
        const requestAnimationFrameId = startVoicePowerCalculation(streamLocal.audio, componentElementRef.current!);

        videooElementRef.current!.srcObject = streamLocal.audio;

        return () => {
          window.cancelAnimationFrame(requestAnimationFrameId);
        };
      }
    });

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className={`${styles.user} ${isUserConnected === false ? styles.notConnected : ""}`} ref={componentElementRef}>
      <audio ref={audioElementRef} autoPlay muted={false}></audio>
      <video
        className={`${isRemoteVideoStreamOn ? "" : currentUserId !== userId ? styles.off : streamLocal.video.getVideoTracks()[0].enabled ? "" : styles.off}`}
        ref={videooElementRef}
        autoPlay
        muted={true}
        width={640}
        height={360}></video>
      <div
        className={`${styles.userData} ${
          isRemoteVideoStreamOn
            ? styles.remoteVideoStreamOn
            : currentUserId !== userId
            ? styles.remoteVideoStreamOff
            : streamLocal.video.getVideoTracks()[0].enabled
            ? styles.remoteVideoStreamOn
            : styles.remoteVideoStreamOff
        }`}>
        <div className={`${styles.outsideImageWrapper}`}>
          <div className={`${styles.imageWrapper}`}>
            <Image src={profileImage} alt={"Zdjęcie użytkownika"} width={256} height={256}></Image>
          </div>
          <div className={`${styles.voiceRange}`}></div>
        </div>
        <p>{publicId}</p>
      </div>
    </div>
  );
};

export default User;
