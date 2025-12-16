import React, { useState } from 'react';
import CameraCapture from './CameraCapture';
import ResultSlider from './ResultSlider';
import { analyzeSkin } from './api'; // Assume API helper exists

const PHASES = {
    TOS: 'tos',
    CAMERA: 'camera',
    ANALYZING: 'analyzing',
    RESULTS: 'results',
    REPORT: 'report',
    SUCCESS: 'success'
};

const TERMS_CONTENT = "Dengan melanjutkan, Anda menyetujui pemindaian wajah untuk analisis kulit...";

export default function SkinAnalysisFlow() {
    const [phase, setPhase] = useState(PHASES.TOS);
    const [analysisData, setAnalysisData] = useState(null);
    const [currentResultIndex, setCurrentResultIndex] = useState(0);

    const handleToSAccept = () => setPhase(PHASES.CAMERA);

    const handleCapture = async (imageBlob) => {
        setPhase(PHASES.ANALYZING);
        try {
            const results = await analyzeSkin(imageBlob);
            setAnalysisData(results);
            setPhase(PHASES.RESULTS);
        } catch (error) {
            console.error("Analysis failed", error);
            alert("Gagal memproses gambar. Silakan coba lagi.");
            setPhase(PHASES.CAMERA);
        }
    };

    const nextResult = () => {
        if (currentResultIndex < analysisData.length - 1) {
            setCurrentResultIndex(prev => prev + 1);
        } else {
            setPhase(PHASES.REPORT);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            {phase === PHASES.TOS && (
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
                    <h2 className="text-xl font-bold mb-4">Persetujuan Analisis</h2>
                    <p className="mb-6 text-gray-600">{TERMS_CONTENT}</p>
                    <button
                        onClick={handleToSAccept}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Saya Setuju
                    </button>
                </div>
            )}

            {phase === PHASES.CAMERA && (
                <CameraCapture onCapture={handleCapture} />
            )}

            {phase === PHASES.ANALYZING && (
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Sedang Menganalisis Wajah Anda...</p>
                </div>
            )}

            {phase === PHASES.RESULTS && analysisData && (
                <div className="w-full max-w-2xl">
                    <div className="mb-4">
                        <div className="h-2 bg-gray-200 rounded-full">
                            <div
                                className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                                style={{ width: `${((currentResultIndex + 1) / analysisData.length) * 100}%` }}
                            />
                        </div>
                        <p className="text-right text-sm text-gray-500 mt-1">
                            Step {currentResultIndex + 1} dari {analysisData.length}
                        </p>
                    </div>

                    <ResultSlider
                        result={analysisData[currentResultIndex]}
                        onNext={nextResult}
                        isLast={currentResultIndex === analysisData.length - 1}
                    />
                </div>
            )}

            {phase === PHASES.REPORT && (
                <div className="text-center bg-white p-8 rounded-lg shadow-xl">
                    <img src="/assets/bitmoji-finish.png" alt="Great Job" className="mx-auto w-32 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Analisis Selesai!</h2>
                    <p className="mb-6">Data kulit Anda telah berhasil direkam.</p>
                    <button
                        onClick={() => setPhase(PHASES.SUCCESS)}
                        className="bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-green-700 transition"
                    >
                        Lihat Hasil Lengkap
                    </button>
                </div>
            )}

            {phase === PHASES.SUCCESS && (
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-green-600 mb-4">Selamat! Registrasi Berhasil</h1>
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
                        <strong>Voucher Promo:</strong> NEWUSER2025
                    </div>
                    <a
                        href="https://wa.me/6281234567890?text=Halo%20saya%20ingin%20reservasi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
                    >
                        <span className="mr-2">📅</span> Reservasi via WhatsApp
                    </a>
                </div>
            )}
        </div>
    );
}
