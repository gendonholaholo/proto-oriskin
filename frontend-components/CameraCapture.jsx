import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';

// Note: In real implementation, install @mediapipe/face_mesh
// import { FaceMesh } from '@mediapipe/face_mesh';

export default function CameraCapture({ onCapture }) {
    const webcamRef = useRef(null);
    const [warnings, setWarnings] = useState([]);
    const [isSteady, setIsSteady] = useState(false);

    // Mocking MediaPipe validation loop
    useEffect(() => {
        const interval = setInterval(() => {
            // Logic:
            // 1. Get video frame from webcamRef
            // 2. Send to MediaPipe FaceMesh
            // 3. Check landmarks:
            //    - If forehead points covered -> "Rambut menutupi kening"
            //    - If eye area has extra geometry -> "Lepas kacamata"
            //    - If face bounding box too small/large -> "Dekatkan/Jauhkan wajah"

            // Simulating "All Good" after 3 seconds for demo
            const randomCheck = Math.random();
            if (randomCheck > 0.7) {
                setWarnings([]);
                setIsSteady(true);
            } else {
                setWarnings(["Pastikan wajah terlihat jelas dan pencahayaan cukup"]);
                setIsSteady(false);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const capture = React.useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        // Convert base64 to blob if API needs blob
        fetch(imageSrc)
            .then(res => res.blob())
            .then(blob => onCapture(blob));
    }, [webcamRef, onCapture]);

    return (
        <div className="relative w-full max-w-lg mx-auto bg-black rounded-xl overflow-hidden shadow-2xl">
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-auto"
                videoConstraints={{ facingMode: "user" }}
            />

            {/* Overlay Guide Box */}
            <div className="absolute inset-0 border-4 border-white/30 rounded-full m-12 pointer-events-none"></div>

            {/* Warnings / Feedback */}
            <div className="absolute top-4 left-0 right-0 text-center">
                {warnings.map((w, i) => (
                    <span key={i} className="inline-block bg-red-500/80 text-white px-3 py-1 rounded-full text-sm font-medium mx-1">
                        ⚠️ {w}
                    </span>
                ))}
            </div>

            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <button
                    onClick={capture}
                    disabled={!isSteady}
                    className={`h-16 w-16 rounded-full border-4 border-white flex items-center justify-center transition-all ${isSteady ? 'bg-red-500 hover:scale-110 shadow-[0_0_20px_rgba(255,0,0,0.5)] cursor-pointer' : 'bg-gray-500 cursor-not-allowed opacity-50'
                        }`}
                >
                    <div className="h-12 w-12 bg-white rounded-full"></div>
                </button>
            </div>

            {!isSteady && (
                <p className="absolute bottom-24 w-full text-center text-white text-sm shadow-black drop-shadow-md">
                    Tahan sebentar...
                </p>
            )}
        </div>
    );
}
