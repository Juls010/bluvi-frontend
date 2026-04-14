import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface AnimatedStepProps {
    children: ReactNode;
    className?: string;
}

export const AnimatedStep = ({ children, className = "justify-between" }: AnimatedStepProps) => {
    const { pathname } = useLocation();
    const isRegisterRoute = pathname.startsWith('/register/');
    const minHeightClass = isRegisterRoute ? 'h-full min-h-full' : 'min-h-screen';
    const spacingClass = isRegisterRoute
        ? 'pt-8 pb-5 md:pt-10 md:pb-6 [@media(max-height:900px)]:pt-6 [@media(max-height:900px)]:pb-4 [@media(max-height:760px)]:pt-4 [@media(max-height:760px)]:pb-3'
        : 'pt-12 pb-7';
    const initialAnimation = isRegisterRoute ? { opacity: 0 } : { opacity: 0, y: 15 };
    const animateAnimation = isRegisterRoute ? { opacity: 1 } : { opacity: 1, y: 0 };
    const exitAnimation = isRegisterRoute ? { opacity: 0 } : { opacity: 0, y: -15 };

    return (
        <motion.div
            initial={initialAnimation}
            animate={animateAnimation}
            exit={exitAnimation}
            transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 20,
                mass: 0.5 
            }}
            className={`w-full ${minHeightClass} flex flex-col items-center ${spacingClass} px-6 [@media(max-height:900px)]:px-5 [@media(max-height:760px)]:px-4 ${className}`}
            >
            {children}
        </motion.div>
    );
};