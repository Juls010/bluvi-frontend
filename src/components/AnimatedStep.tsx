import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface AnimatedStepProps {
    children: ReactNode;
}

export const AnimatedStep = ({ children }: AnimatedStepProps) => {
    return (
        <motion.div
        initial={{ opacity: 0, y: 10 }}    
        animate={{ opacity: 1, y: 0 }}     
        exit={{ opacity: 0, y: -10 }}      
        transition={{ duration: 0.4, ease: "easeOut" }} 
        className="w-full h-full flex flex-col items-center justify-center"
        >
        {children}
        </motion.div>
    );
};