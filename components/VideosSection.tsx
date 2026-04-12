"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";

export default function VideosSection() {
    const [playingVideo, setPlayingVideo] = useState<string | null>(null);

    const videos = [
        { id: 1, thumb: "/thumbnails/thumb1.jpg", src: "/videos/vid1.mp4", title: "Promo 1" },
        { id: 2, thumb: "/thumbnails/thumb2.jpg", src: "/videos/vid2.mp4", title: "Tutorial 1" },
        { id: 3, thumb: "/thumbnails/thumb3.jpg", src: "/videos/vid3.mp4", title: "Promo 2" },
        { id: 4, thumb: "/thumbnails/thumb4.jpg", src: "/videos/vid4.mp4", title: "Tutorial 2" },
        { id: 5, thumb: "/thumbnails/thumb5.jpg", src: "/videos/vid5.mp4", title: "Promo 3", isFeatured: true },
        { id: 6, thumb: "/thumbnails/thumb6.jpg", src: "/videos/vid6.mp4", title: "Tutorial 3", isFeatured: true },
    ];

    return (
        <>
            <section className="relative w-full h-[90vh] min-h-[850px] overflow-hidden bg-[#fdfbf6] pt-16 z-20 shadow-[0_-15px_30px_rgba(0,0,0,0.5)] border-t-8 border-[#111]">

                {/* ══════════════ 1. خلفية الخريطة ══════════════ */}
                <div
                    className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
                    style={{
                        backgroundImage: 'url("/map-bg2.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 1
                    }}
                />

                {/* ══════════════ 2. فيديو المياه ══════════════ */}
                <div className="absolute bottom-0 left-0 w-full h-[65%] z-[10] pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white via-white/80 to-transparent z-[2]" />
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute bottom-0 left-0 w-full h-full object-cover object-top opacity-90"
                        src="/wave-bg.mp4"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#005ea3]/20 via-transparent to-transparent z-[3]" />
                </div>

                <div className="flex flex-col items-center gap-6 w-full relative z-[35]">

                    {/* الصف الأول (4 فيديوهات) */}
                    <div className="flex justify-center gap-3 md:gap-5 w-full">
                        {videos.slice(0, 4).map((vid) => (
                            <div
                                key={vid.id}
                                onClick={() => setPlayingVideo(vid.src)}

                                className="relative group w-[22%] max-w-[240px] aspect-video cursor-pointer border-[3px] border-transparent hover:border-yellow-400 transition-colors shadow-lg overflow-hidden bg-black"
                            >
                                {/* حطينا الفيديو بدل الصورة عشان يشتغل كـ Thumbnail */}
                                <video
                                    src={vid.src}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                />

                                {/* طبقة شفافة وأيقونة Play */}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Play className="w-5 h-5 text-white ml-1" fill="currentColor" />
                                    </div>
                                </div>

                                {/* عنوان الفيديو */}
                                <div className="absolute bottom-2 left-2 text-white/80 text-xs font-bold pointer-events-none drop-shadow-md">
                                    {vid.title}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* الصف الثاني (2 فيديو مميزين) */}
                    <div className="flex justify-center gap-3 border-[4px] border-yellow-400 p-1.5 bg-[#111] shadow-2xl relative z-[35]">
                        {videos.slice(4, 6).map((vid) => (
                            <div
                                key={vid.id}
                                onClick={() => setPlayingVideo(vid.src)}
                                className="relative group w-[180px] md:w-[260px] aspect-video cursor-pointer overflow-hidden bg-black"
                            >
                                {/* نفس الفكرة، فيديو شغال صامت كخلفية */}
                                <video
                                    src={vid.src}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                                />

                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-transparent transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-black/50 border border-white flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                                    </div>
                                </div>

                                {/* عنوان الفيديو */}
                                <div className="absolute bottom-2 left-2 text-white/90 text-sm font-bold pointer-events-none drop-shadow-lg">
                                    {vid.title}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ══════════════ 4. الكروت الطائرة ══════════════ */}
                <motion.div className="absolute left-[35%] bottom-[10%] w-20 md:w-24 z-[25] drop-shadow-xl" initial={{ y: 0, rotate: 15 }} animate={{ y: [-10, 10, -10], rotate: [15, 20, 15] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                    <img src="/card-red.png" alt="Card" className="w-full h-auto border-2 border-white rounded shadow-lg" onError={(e) => e.currentTarget.src = "https://tcg.pokemon.com/img/tcg-xy-xy11-19.jpg"} />
                </motion.div>
                <motion.div className="absolute right-[35%] bottom-[30%] w-24 md:w-32 z-[25] drop-shadow-2xl" initial={{ y: 0, rotate: -20 }} animate={{ y: [15, -15, 15], rotate: [-20, -15, -20] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
                    <img src="/card-red.png" alt="Red Card" className="w-full h-auto rounded shadow-lg" onError={(e) => e.currentTarget.src = "https://tcg.pokemon.com/img/tcg-xy-xy11-19.jpg"} />
                </motion.div>
                <motion.div className="absolute right-[5%] bottom-[15%] w-56 md:w-80 z-[25] drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)]" initial={{ y: 0, rotate: -25 }} animate={{ y: [-20, 20, -20], rotate: [-25, -20, -25] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
                    <img src="/card-blue.png" alt="Blue Card" className="w-full h-auto rounded-xl border-4 border-[#1c2c54]" onError={(e) => e.currentTarget.src = "https://tcg.pokemon.com/img/tcg-xy-xy11-19.jpg"} />
                </motion.div>

                {/* ══════════════ 5. الشخصية (لوفي بيجري) ══════════════ */}
                <div className="absolute bottom-0 left-0 w-full h-full z-[25] pointer-events-none overflow-hidden">
                    <motion.div initial={{ x: -150, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ type: "spring", duration: 1.5, bounce: 0.3 }} className="absolute -bottom-2 left-[-5%] h-[75%] md:h-[85%] lg:h-[90%] w-auto flex items-end">
                        <img src="/footer_illust_chara.png" alt="Luffy" className="h-full w-auto object-contain object-bottom drop-shadow-[15px_10px_20px_rgba(0,0,0,0.5)]" onError={(e) => e.currentTarget.style.display = 'none'} />
                    </motion.div>
                </div>

                {/* ══════════════ 6. نصوص SET SAIL ══════════════ */}
                <div className="absolute bottom-[8%] right-[5%] z-[40] pointer-events-none flex flex-col items-end">
                    <motion.h2 initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-5xl md:text-7xl font-bold text-white tracking-widest mb-[-10px]" style={{ fontFamily: '"Times New Roman", Times, serif', textShadow: '3px 3px 0px #4a8cb8, 6px 6px 15px rgba(0,0,0,0.5)' }}>
                        SET SAIL!
                    </motion.h2>
                    <motion.h2 initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-4xl md:text-6xl font-black text-white tracking-widest uppercase" style={{ fontFamily: '"Times New Roman", Times, serif', textShadow: '3px 3px 0px #4a8cb8, 6px 6px 15px rgba(0,0,0,0.5)' }}>
                        CARD GAME
                    </motion.h2>
                </div>
            </section>

            {/* ══════════════ 7. نافذة تشغيل الفيديو (Video Player Modal) ══════════════ */}
            <AnimatePresence>
                {playingVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        // لما تدوسي برة الفيديو هيقفل لوحده
                        onClick={() => setPlayingVideo(null)}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
                    >
                        {/* زرار القفل (X) */}
                        <button
                            className="absolute top-6 right-6 md:top-10 md:right-10 text-white hover:text-red-500 transition-colors z-[101]"
                            onClick={() => setPlayingVideo(null)}
                        >
                            <X className="w-10 h-10" />
                        </button>

                        {/* كونتينر الفيديو نفسه */}
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: "spring", bounce: 0.3 }}
                            // e.stopPropagation() بتمنع القفل لو دوستي على الفيديو نفسه
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.3)] border-2 border-yellow-500"
                        >
                            <video
                                src={playingVideo}
                                controls
                                autoPlay
                                className="w-full h-full object-contain"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}