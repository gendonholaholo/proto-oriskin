import React, { useState, useEffect } from 'react';
import CameraCapture from './CameraCapture';
import ResultSlider from './ResultSlider';
import { analyzeSkin, getServiceInfo } from '../api';

const PHASES = {
    TOS: 'tos',
    CAMERA: 'camera',
    ANALYZING: 'analyzing',
    RESULTS: 'results',
    REPORT: 'report',
    FULL_RESULTS: 'full_results', // NEW: Halaman hasil lengkap
    SUCCESS: 'success'
};

const TERMS_CONTENT = "Dengan melanjutkan, Anda menyetujui pemindaian wajah untuk analisis kulit. Data wajah Anda akan diproses secara aman dan hanya digunakan untuk memberikan rekomendasi perawatan kulit yang sesuai.";

function MockModeIndicator({ isMock }) {
    if (!isMock) return null;
    return (
        <div className="fixed top-4 right-4 z-50">
            <div className="bg-amber-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                    <p className="font-bold text-sm">MOCK MODE</p>
                    <p className="text-xs opacity-90">Data simulasi aktif</p>
                </div>
            </div>
        </div>
    );
}

function MockDataBanner({ isMock }) {
    if (!isMock) return null;
    return (
        <div className="bg-amber-100 border border-amber-300 text-amber-800 px-4 py-2 rounded-lg mb-4 text-center">
            <span className="font-semibold">Data Mock/Simulasi</span>
            <span className="mx-2">|</span>
            <span className="text-sm">Hasil ini menggunakan data acak untuk testing</span>
        </div>
    );
}

// Helper function to get level color
function getLevelColor(level) {
    switch (level) {
        case 'Low': return 'text-green-600 bg-green-100';
        case 'Moderate': return 'text-yellow-600 bg-yellow-100';
        case 'High': return 'text-red-600 bg-red-100';
        default: return 'text-gray-600 bg-gray-100';
    }
}

export default function SkinAnalysisContainer() {
    const [phase, setPhase] = useState(PHASES.TOS);
    const [analysisData, setAnalysisData] = useState(null);
    const [currentResultIndex, setCurrentResultIndex] = useState(0);
    const [capturedImage, setCapturedImage] = useState(null);
    const [serviceInfo, setServiceInfo] = useState({ mock_mode: false });
    const [isMockResult, setIsMockResult] = useState(false);

    useEffect(() => {
        getServiceInfo()
            .then(info => setServiceInfo(info))
            .catch(err => console.warn('Could not fetch service info:', err));
    }, []);

    const handleToSAccept = () => setPhase(PHASES.CAMERA);

    const handleCapture = async (imageBlob) => {
        setPhase(PHASES.ANALYZING);
        setCapturedImage(URL.createObjectURL(imageBlob));
        try {
            const results = await analyzeSkin(imageBlob);
            setAnalysisData(results);
            setIsMockResult(results.is_mock || false);
            setPhase(PHASES.RESULTS);
        } catch (error) {
            console.error("Analysis failed", error);
            alert("Gagal memproses gambar. Silakan coba lagi.");
            setPhase(PHASES.CAMERA);
        }
    };

    const nextResult = () => {
        if (analysisData?.results && currentResultIndex < analysisData.results.length - 1) {
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
        setIsMockResult(false);
    };

    const results = analysisData?.results || [];

    return (
        <div className="min-h-screen bg-[#f8f4f0] flex flex-col items-center justify-center p-4">
            <MockModeIndicator isMock={serviceInfo.mock_mode} />

            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-[#8B7355]">Oriskin</h1>
                <p className="text-gray-600">Analisis Kulit Profesional</p>
            </div>

            {/* PHASE: TOS */}
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

            {/* PHASE: CAMERA */}
            {phase === PHASES.CAMERA && (
                <div className="w-full max-w-lg">
                    <p className="text-center text-gray-600 mb-4">
                        Posisikan wajah Anda dalam lingkaran dan pastikan pencahayaan cukup
                    </p>
                    <CameraCapture onCapture={handleCapture} />
                </div>
            )}

            {/* PHASE: ANALYZING */}
            {phase === PHASES.ANALYZING && (
                <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                    <div className="animate-spin h-12 w-12 border-4 border-[#8B7355] border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-700 font-medium">Sedang Menganalisis Wajah Anda...</p>
                    <p className="text-sm text-gray-500 mt-2">Mohon tunggu sebentar</p>
                </div>
            )}

            {/* PHASE: RESULTS (per-condition slider) */}
            {phase === PHASES.RESULTS && results.length > 0 && (
                <div className="w-full max-w-2xl">
                    <MockDataBanner isMock={isMockResult} />
                    <div className="mb-4">
                        <div className="h-2 bg-gray-200 rounded-full">
                            <div
                                className="h-2 bg-[#8B7355] rounded-full transition-all duration-300"
                                style={{ width: `${((currentResultIndex + 1) / results.length) * 100}%` }}
                            />
                        </div>
                        <p className="text-right text-sm text-gray-500 mt-1">
                            Langkah {currentResultIndex + 1} dari {results.length}
                        </p>
                    </div>
                    <ResultSlider
                        result={results[currentResultIndex]}
                        originalImage={capturedImage}
                        onNext={nextResult}
                        isLast={currentResultIndex === results.length - 1}
                    />
                </div>
            )}

            {/* PHASE: REPORT (summary before full results) */}
            {phase === PHASES.REPORT && (
                <div className="text-center bg-white p-8 rounded-xl shadow-xl max-w-md">
                    {isMockResult && (
                        <div className="bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full mb-4 inline-block">
                            Data Simulasi
                        </div>
                    )}
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">✓</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-800">Analisis Selesai!</h2>
                    <p className="mb-2 text-gray-600">Data kulit Anda telah berhasil dianalisis.</p>
                    {analysisData?.overall_score && (
                        <p className="mb-4 text-lg font-semibold text-[#8B7355]">
                            Skor Keseluruhan: {analysisData.overall_score}/100
                        </p>
                    )}
                    <button
                        onClick={() => setPhase(PHASES.FULL_RESULTS)}
                        className="bg-[#8B7355] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#7a6548] transition"
                    >
                        Lihat Hasil Lengkap
                    </button>
                </div>
            )}

            {/* PHASE: FULL_RESULTS (detailed analysis view) */}
            {phase === PHASES.FULL_RESULTS && (
                <div className="w-full max-w-2xl">
                    <div className="bg-white p-6 rounded-xl shadow-xl">
                        {isMockResult && (
                            <div className="bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full mb-4 inline-block">
                                Data Simulasi
                            </div>
                        )}
                        
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                            Hasil Analisis
                        </h2>
                        <p className="text-center text-gray-500 mb-6">
                            Ringkasan kondisi kulit Anda
                        </p>

                        {/* Overall Score */}
                        <div className="bg-[#f8f4f0] rounded-xl p-6 mb-6 text-center">
                            <p className="text-sm text-gray-500 mb-1">Skor Keseluruhan</p>
                            <p className="text-5xl font-bold text-[#8B7355]">
                                {analysisData?.overall_score || 0}
                                <span className="text-2xl text-gray-400">/100</span>
                            </p>
                        </div>

                        {/* Condition Results Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {results.map((result, index) => (
                                <div 
                                    key={index}
                                    className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-medium text-gray-700">
                                            {result.condition}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(result.score.level)}`}>
                                            {result.score.level}
                                        </span>
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <span className="text-2xl font-bold text-gray-800">
                                            {result.score.value}
                                        </span>
                                        <span className="text-sm text-gray-400 mb-1">/100</span>
                                    </div>
                                    {/* Progress bar */}
                                    <div className="h-2 bg-gray-200 rounded-full mt-2">
                                        <div 
                                            className="h-2 rounded-full transition-all"
                                            style={{ 
                                                width: `${result.score.value}%`,
                                                backgroundColor: result.overlay_color || '#8B7355'
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={() => setPhase(PHASES.SUCCESS)}
                            className="w-full bg-[#8B7355] text-white py-3 rounded-lg font-bold hover:bg-[#7a6548] transition"
                        >
                            Lanjut ke Reservasi
                        </button>
                    </div>
                </div>
            )}

            {/* PHASE: SUCCESS (reservation) */}
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
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Reservasi via WhatsApp
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
