import React from 'react';
import { type User } from '../data/mockUsers';

interface UserCardProps {
    user: User;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
    return (
        <div className="group relative w-full h-96 rounded-3xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02] cursor-pointer bg-white">

        <img 
            src={user.image} 
            alt={user.name} 
            className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90"></div>

        <div className="absolute bottom-0 left-0 w-full p-6 text-white">
            
            <div className="flex items-end gap-2 mb-2">
                <h3 className="text-3xl font-bold font-heading">{user.name}</h3>
                <span className="text-xl opacity-80 mb-1">{user.age}</span>
            </div>
            
            <p className="text-sm opacity-70 mb-4 flex items-center gap-1">
                {user.location}
            </p>

            <div className="flex flex-wrap gap-2">
                {user.interests.slice(0, 3).map((interest, index) => (
                    <span key={index} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium border border-white/30">
                        {interest}
                    </span>
                ))}
                {user.interests.length > 3 && (
                    <span className="px-2 py-1 text-xs opacity-70">+{user.interests.length - 3}</span>
                )}
            </div>

        </div>

        <div className="absolute bottom-6 right-6 w-12 h-12 bg-white text-bluvi-purple rounded-full flex items-center justify-center shadow-lg transform translate-y-20 group-hover:translate-y-0 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>

        </div>
    );
};