import React, { useState, useRef } from 'react';

interface Photo {
    id: number;
    image: string;
    alt: string;
}

interface SimpleCarouselProps {
    photos: Photo[];
}

export const SimpleCarousel: React.FC<SimpleCarouselProps> = ({ photos }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollRef.current) {
        const scrollPosition = scrollRef.current.scrollLeft;
        const width = scrollRef.current.offsetWidth;
        const newIndex = Math.round(scrollPosition / width);
        setCurrentIndex(newIndex);
        }
    };

    const scrollTo = (index: number) => {
        if (scrollRef.current) {
        const width = scrollRef.current.offsetWidth;
        scrollRef.current.scrollTo({
            left: width * index,
            behavior: 'smooth' 
        });
        }
    };

    return (
        <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-lg bg-gray-100">

        <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{ scrollBehavior: 'smooth' }}
        >
            {photos.map((photo) => (
            <div 
                key={photo.id} 
                className="w-full h-full flex-shrink-0 snap-center relative"
            >
                <img 
                src={photo.image} 
                alt={photo.alt} 
                className="w-full h-full object-cover"
                draggable={false}
                />
            </div>
            ))}
        </div>

        {photos.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {photos.map((_, index) => (
                <button
                key={index}
                onClick={() => scrollTo(index)} 
                aria-label={`Ver foto ${index + 1}`}
                className={`w-2 h-2 rounded-full transition-all duration-300 shadow-sm
                    ${currentIndex === index 
                    ? 'bg-white w-6' 
                    : 'bg-white/50 hover:bg-white/80'}`
                }
                />
            ))}
            </div>
        )}

        <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
            {currentIndex > 0 && (
                <button onClick={() => scrollTo(currentIndex - 1)} className="pointer-events-auto p-2 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm transition-colors">←</button>
            )}
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            {currentIndex < photos.length - 1 && (
                <button onClick={() => scrollTo(currentIndex + 1)} className="pointer-events-auto p-2 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm transition-colors">→</button>
            )}
        </div>

        </div>
    );
};