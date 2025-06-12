import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { assets } from '../assets/assets';

function LoadingScreen({ onLoadingComplete }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (progress < 100) {
                setProgress(prev => prev + 1);
            } else {
                onLoadingComplete();
            }
        }, 50);

        return () => clearTimeout(timer);
    }, [progress, onLoadingComplete]);

    return (
        <div className="fixed inset-0 bg-[#111111] z-50 flex flex-col items-center justify-center overflow-hidden">
            {/* Animated background images */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.15, scale: 1 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                className="absolute sm:right-0 sm:top-0 right-0 top-1/4 w-full sm:w-1/3 h-1/2 sm:h-full"
            >
                <img src={assets.welcome1} alt="Decorative" className="w-full h-full object-cover opacity-20" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.15, scale: 1 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                className="absolute sm:left-0 sm:bottom-0 left-0 bottom-1/4 w-full sm:w-1/3 h-1/2 sm:h-full"
            >
                <img src={assets.welcome2} alt="Decorative" className="w-full h-full object-cover opacity-20" />
            </motion.div>

            {/* Main content */}
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center space-y-8 relative z-10"
            >
                <motion.img 
                    src={assets.logo} 
                    alt="Logo" 
                    className="w-32 sm:w-40 md:w-48"
                    animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 2, 0, -2, 0]
                    }}
                    transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                
                <div className="w-64 sm:w-80 h-2 bg-[#212121] rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-yellow-200 to-green-500"
                    />
                </div>
                
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white font-Syne text-lg sm:text-xl"
                >
                    Loading your creative journey...
                </motion.p>

                {/* Animated stars */}
                <div className="flex space-x-4">
                    {[0, 1, 2].map((index) => (
                        <motion.img
                            key={index}
                            src={assets.star}
                            alt="Star"
                            className="w-6 h-6"
                            animate={{
                                rotate: [0, 360],
                                scale: [1, 1.2, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: index * 0.3
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

export default LoadingScreen; 