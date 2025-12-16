import React, { useState } from 'react';
import CameraCapture from './CameraCapture';
import ResultSlider from './ResultSlider';
import { analyzeSkin } from '../api';

const PHASES = {
    TOS: 'tos',
    CAMERA: 'camera',
    ANALYZING: 'analyzing',
    RESULTS: 'results',
    REPORT: 'report',
    SUCCESS: 'success'
};

const TERMS_CONTENT = "Dengan melanjutkan, Anda menyetujui pemindaian wajah untuk analisis kulit. Data wajah Anda akan diproses secara aman dan hanya digunakan untuk memberikan rekomendasi perawatan kulit yang sesuai.";

export default function SkinAnalysisContainer() {
    const [phase, setPhase] = useState(PHASES.TOS);
    const [analysisData, setAnalysisData] = useState(null);
    const [currentResultIndex, setCurrentResultIndex] = useState(0);
    const [capturedImage, setCapturedImage] = useState(null);

    const handleToSAccept = () => setPhase(PHASES.CAMERA);

    const handleCapture = async (imageBlob) => {
        setPhase(PHASES.ANALYZING);
        // Store captured image for display in results
        setCapturedImage(URL.createObjectURL(imageBlob));

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

    const resetFlow = () => {
        setPhase(PHASES.TOS);
        setAnalysisData(null);
        setCurrentResultIndex(0);
        setCapturedImage(null);
    };

    return (
        <div className="min-h-screen bg-[#f8f4f0] flex flex-col items-center justify-center p-4">
            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-[#8B7355]">Oriskin</h1>
                <p className="text-gray-600">Analisis Kulit Profesional</p>
            </div>

            {phase === PHASES.TOS && (
                <div className="bg-white p-6 rounded-xl shadow-lg max-w-md">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Persetujuan Analisis</h2>
                    <p className="mb-6 text-gray-600 leading-relaxed">{TERMS_CONTENT}</p>
                    <button
                        onClick={handleToSAccept}
                        className="w-full bg-[#8B7355] text-white py-3 rounded-lg hover:bg-[#7a6548] transition font-medium"
                    >
                        Saya Setuju & Mulai Analisis
                    </button>
                </div>
            )}

            {phase === PHASES.CAMERA && (
                <div className="w-full max-w-lg">
                    <p className="text-center text-gray-600 mb-4">
                        Posisikan wajah Anda dalam lingkaran dan pastikan pencahayaan cukup
                    </p>
                    <CameraCapture onCapture={handleCapture} />
                </div>
            )}

            {phase === PHASES.ANALYZING && (
                <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                    <div className="animate-spin h-12 w-12 border-4 border-[#8B7355] border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-700 font-medium">Sedang Menganalisis Wajah Anda...</p>
                    <p className="text-sm text-gray-500 mt-2">Mohon tunggu sebentar</p>
                </div>
            )}

            {phase === PHASES.RESULTS && analysisData && (
                <div className="w-full max-w-2xl">
                    <div className="mb-4">
                        <div className="h-2 bg-gray-200 rounded-full">
                            <div
                                className="h-2 bg-[#8B7355] rounded-full transition-all duration-300"
                                style={{ width: `${((currentResultIndex + 1) / analysisData.length) * 100}%` }}
                            />
                        </div>
                        <p className="text-right text-sm text-gray-500 mt-1">
                            Langkah {currentResultIndex + 1} dari {analysisData.length}
                        </p>
                    </div>

                    <ResultSlider
                        result={analysisData[currentResultIndex]}
                        originalImage={capturedImage}
                        onNext={nextResult}
                        isLast={currentResultIndex === analysisData.length - 1}
                    />
                </div>
            )}

            {phase === PHASES.REPORT && (
                <div className="text-center bg-white p-8 rounded-xl shadow-xl max-w-md">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">✓</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-800">Analisis Selesai!</h2>
                    <p className="mb-6 text-gray-600">Data kulit Anda telah berhasil dianalisis.</p>
                    <button
                        onClick={() => setPhase(PHASES.SUCCESS)}
                        className="bg-[#8B7355] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#7a6548] transition"
                    >
                        Lihat Hasil Lengkap
                    </button>
                </div>
            )}

            {phase === PHASES.SUCCESS && (
                <div className="text-center bg-white p-8 rounded-xl shadow-xl max-w-md">
                    <h1 className="text-2xl font-bold text-green-600 mb-4">Selamat! Registrasi Berhasil</h1>

                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
                        <p className="text-sm">Voucher Promo Eksklusif:</p>
                        <p className="font-bold text-lg">NEWUSER2025</p>
                    </div>

                    <p className="text-gray-600 mb-6">
                        Gunakan voucher ini untuk mendapatkan diskon pada kunjungan pertama Anda!
                    </p>

                    <div className="space-y-3">
                        <a
                            href="https://wa.me/6281234567890?text=Halo%20saya%20ingin%20reservasi%20setelah%20melakukan%20analisis%20kulit"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
                        >
                            <span className="mr-2">📱</span> Reservasi via WhatsApp
                        </a>

                        <button
                            onClick={resetFlow}
                            className="w-full text-gray-500 hover:text-gray-700 py-2 transition"
                        >
                            Mulai Analisis Baru
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
