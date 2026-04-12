"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";


const cardImages = [

  "/cards/card3.png",
  "/cards/card4.png",
  "/cards/card5.png",
  "/cards/card6.png",
  "/cards/card7.png",

  "/cards/card9.png",
  "/cards/card10.png",
  "/cards/card11.png",
  "/cards/card12.png",
  "/cards/card13.png",
  "/cards/card14.png",
];

// أحجام وسرعات مظبوطة جداً لتبان واضحة وسريعة
const cardConfigs = [
  { src: cardImages[0], left: "5%", duration: 15, delay: 0, rotate: 15, opacity: 0.8, blur: false, width: 200 },
  { src: cardImages[1], left: "20%", duration: 18, delay: 3, rotate: -10, opacity: 0.5, blur: true, width: 160 },
  { src: cardImages[2], left: "75%", duration: 12, delay: 1, rotate: 20, opacity: 0.9, blur: false, width: 220 },
  { src: cardImages[3], left: "85%", duration: 20, delay: 5, rotate: -15, opacity: 0.4, blur: true, width: 150 },
  { src: cardImages[4], left: "12%", duration: 16, delay: 7, rotate: 25, opacity: 0.7, blur: false, width: 180 },
  { src: cardImages[5], left: "80%", duration: 14, delay: 2, rotate: -5, opacity: 0.85, blur: false, width: 250 },
  { src: cardImages[0], left: "28%", duration: 19, delay: 8, rotate: 12, opacity: 0.3, blur: true, width: 140 },
  { src: cardImages[3], left: "65%", duration: 17, delay: 4, rotate: -18, opacity: 0.6, blur: false, width: 170 },
];

const FloatingCardsCTA: React.FC = () => {
  return (
    <section className="relative min-h-[80vh] overflow-hidden bg-black">

      {/* 
        طبقة الخريطة كخلفية )
      */}
      <div
        className="absolute inset-0 z-0 opacity-35 pointer-events-none bg-center bg-cover bg-no-repeat bg-fixed"
        style={{ backgroundImage: "url('/map-bg.jpg')" }}
      />


      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-black/40 to-black pointer-events-none" />

      {/* Top fade divider for seamless blending */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />

      {/* Radial glow behind text */}
      <div className="absolute inset-0 z-[5] flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(255,200,50,0.06)_0%,rgba(0,0,0,0)_70%)]" />
      </div>

      {/* 
        الكروت المتطايرة ()
      */}
      <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
        {cardConfigs.map((card, index) => (
          <motion.img
            key={index}
            src={card.src}
            alt={`Floating card ${index + 1}`}
            style={{
              position: 'absolute',
              left: card.left,
              width: card.width,
              opacity: card.opacity,
              zIndex: 1,
              willChange: "transform",
            }}
            className="select-none drop-shadow-[0_0_20px_rgba(255,180,50,0.2)]"
            draggable={false}
            initial={{ top: "110%", rotate: card.rotate }}
            animate={{
              top: "-50%",
              rotate: card.rotate + (index % 2 === 0 ? 15 : -15)
            }}
            transition={{
              duration: card.duration,
              delay: card.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Center story text */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-4xl mx-auto px-4 py-32 min-h-[80vh] justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 drop-shadow-[0_0_25px_rgba(250,204,21,0.35)] mb-6 leading-tight"
        >
          A World of Treasure and Adventure Awaits.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mb-12 tracking-wide drop-shadow-md"
        >
          TCG Vault is a trading card game platform built for collectors and
          champions. Create your very own crew with all of your favorite cards. A
          world united by one grand adventure. Your journey starts here.
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl lg:text-8xl font-black uppercase text-white tracking-tight leading-[1.1] mb-14 drop-shadow-lg"
        >
          Experience it.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">
            This is the New Era of Card Games.
          </span>
        </motion.h2>

        {/* زرار المغامرة بعد التعديل لربطه بصفحة Shop */}
        <Link href="/products" className="relative z-30 inline-block w-fit">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-12 py-5 text-lg md:text-xl font-extrabold uppercase tracking-widest text-black bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 rounded-lg cursor-pointer shadow-[0_0_30px_rgba(250,204,21,0.4)] hover:shadow-[0_0_50px_rgba(250,204,21,0.6),0_0_100px_rgba(250,204,21,0.3)] transition-all duration-300"
          >
            BEGIN YOUR ADVENTURE
          </motion.button>
        </Link>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
    </section>
  );

};

export default FloatingCardsCTA;