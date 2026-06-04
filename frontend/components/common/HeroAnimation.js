"use client";

import Lottie from "lottie-react";
import animationData from "../../public/animations/online-learning.json";

export default function HeroAnimation() {
  return (
    <div className="w-full max-w-3xl">
      <Lottie
        animationData={animationData}
        loop={true}
      />
    </div>
  );
}