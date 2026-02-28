import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface AnimatedStepProps {
    children: ReactNode;
    className?: string;
}

export const AnimatedStep = ({ children, className = "justify-between" }: AnimatedStepProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 20,
                mass: 0.5 
            }}
            className={`w-full min-h-screen flex flex-col items-center pt-12 pb-7 px-6 ${className}`}
            >
            {children}
        </motion.div>
    );
};