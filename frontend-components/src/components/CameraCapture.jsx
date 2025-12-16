import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';

export default function CameraCapture({ onCapture }) {
    const webcamRef = useRef(null);
    const [warnings, setWarnings] = useState([]);
    const [isSteady, setIsSteady] = useState(false);

    // Mocking MediaPipe validation loop
    useEffect(() => {
        const interval = setInterval(() => {
            // Simulating "All Good" after a few seconds for demo
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
        // Convert base64 to blob for API
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
                mirrored={true}
                videoConstraints={{ facingMode: "user" }}
            />

            {/* Face Shape Overlay Guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg
                    viewBox="0 0 200 280"
                    className="w-56 h-80 md:w-64 md:h-96"
                    style={{ marginTop: '-20px' }}
                >
                    {/* Semi-transparent dark overlay outside face area */}
                    <defs>
                        <mask id="faceMask">
                            <rect x="0" y="0" width="200" height="280" fill="white"/>
                            <ellipse cx="100" cy="130" rx="75" ry="100" fill="black"/>
                        </mask>
                    </defs>

                    {/* Face outline - oval shape like real face */}
                    <ellipse
                        cx="100"
                        cy="130"
                        rx="75"
                        ry="100"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeDasharray="8,4"
                        opacity="0.6"
                    />

                    {/* Chin area hint */}
                    <path
                        d="M 50 180 Q 100 240 150 180"
                        fill="none"
                        stroke="white"
                        strokeWidth="1.5"
                        opacity="0.3"
                    />

                    {/* Forehead line hint */}
                    <path
                        d="M 40 80 Q 100 30 160 80"
                        fill="none"
                        stroke="white"
                        strokeWidth="1.5"
                        opacity="0.3"
                    />

                    {/* Center cross guides */}
                    <line x1="100" y1="60" x2="100" y2="200" stroke="white" strokeWidth="1" opacity="0.2"/>
                    <line x1="40" y1="130" x2="160" y2="130" stroke="white" strokeWidth="1" opacity="0.2"/>
                </svg>
            </div>

            {/* Warnings / Feedback */}
            <div className="absolute top-4 left-0 right-0 text-center">
                {warnings.map((w, i) => (
                    <span key={i} className="inline-block bg-red-500/80 text-white px-3 py-1 rounded-full text-sm font-medium mx-1">
                        {w}
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
