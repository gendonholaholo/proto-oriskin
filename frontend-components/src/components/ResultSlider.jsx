import React, { useState } from 'react';

export default function ResultSlider({ result, originalImage, onNext, isLast }) {
    const [sliderPos, setSliderPos] = useState(50);

    const handleDrag = (e) => {
        setSliderPos(e.target.value);
    };

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold capitalize">{result.condition}</h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${result.score.level === 'High' ? 'bg-red-100 text-red-600' :
                            result.score.level === 'Moderate' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-green-100 text-green-600'
                        }`}>
                        Score: {result.score.value} ({result.score.level})
                    </div>
                </div>
            </div>

            <div className="relative w-full aspect-[3/4] max-h-[500px] bg-gray-100 group cursor-ew-resize">
                {/* Background: Original Image */}
                {originalImage ? (
                    <img
                        src={originalImage}
                        alt="Original"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        [Original Image]
                    </div>
                )}

                {/* Foreground: Analyzed Mask (Clipped) */}
                <div
                    className="absolute inset-0 bg-black/50 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                >
                    <img
                        src={`data:image/png;base64,${result.mask_base64}`}
                        alt="Analysis Mask"
                        className="w-full h-full object-cover mix-blend-screen"
                    />
                    <div className="absolute top-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
                        Analisis View
                    </div>
                </div>

                {/* Separator line */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none"
                    style={{ left: `${sliderPos}%` }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-md">
                        <span className="text-gray-600">↔</span>
                    </div>
                </div>

                {/* Input Range for Interaction */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPos}
                    onChange={handleDrag}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
                />
            </div>

            <div className="p-4 bg-gray-50 flex justify-end">
                <button
                    onClick={onNext}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
                >
                    {isLast ? "Lihat Report Selesai" : "Lanjut ke Analisis Berikutnya →"}
                </button>
            </div>
        </div>
    );
}
