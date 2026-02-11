import React from 'react';
import { Link } from 'react-router-dom';

const NewMatchesHorizontal = () => {
    const newMatches = [
        { id: 1, name: "Lucila", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop" },
        { id: 2, name: "Marc", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop" },
    ];

    return (
        <div className="mb-10">
            <h2 className="text-[11px] font-bold text-bluvi-purple uppercase tracking-[0.2em] mb-5 opacity-70">
                Nuevas Conexiones
            </h2>
            <div className="flex overflow-x-auto gap-8 scrollbar-hide py-2">
                {newMatches.map((user) => (
                    <div key={user.id} className="flex flex-col items-center gap-3 flex-shrink-0 group cursor-pointer active:scale-95 transition-transform">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-bluvi-purple to-blue-300 shadow-md">
                                <img src={user.image} className="w-full h-full rounded-full object-cover border-2 border-white" alt={user.name} />
                            </div>
                            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-600 group-hover:text-bluvi-purple transition-colors">
                            {user.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ChatListVertical = () => {
    const chats = [
        { id: 1, name: "Lucila López Quesada", lastMsg: "¿Te gustan las pelis de miedo?", time: "20:08", unread: true, image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop" },
        { id: 2, name: "Esther Medina", lastMsg: "El kiwi, además de una fruta, es un tipo de ave 🤨", time: "17:24", unread: false, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" },
    ];

    return (
        <div className="flex flex-col gap-5">
            <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">
                Conversaciones
            </h2>
            {chats.map((chat) => (
                <Link 
                    to={`/app/chat/${chat.id}`} 
                    key={chat.id} 
                    className="block transition-all active:scale-[0.98]"
                >
                    <div className="bg-white/40 backdrop-blur-md border border-white/60 p-5 rounded-[2.5rem] flex items-center gap-6 hover:bg-white/60 transition-all cursor-pointer shadow-sm hover:shadow-md group">
                        <img src={chat.image} className="w-20 h-20 rounded-[1.5rem] object-cover shadow-sm" alt={chat.name} />
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-bold text-bluvi-purple text-lg truncate group-hover:text-purple-700 transition-colors">
                                    {chat.name}
                                </h3>
                                <span className="text-xs text-gray-400 font-medium">{chat.time}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-gray-500 truncate text-sm italic">
                                    {chat.lastMsg}
                                </p>
                                {chat.unread && (
                                    <div className="w-3 h-3 bg-bluvi-purple rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)] animate-pulse" />
                                )}
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export const Messages: React.FC = () => {
    return (
        <div className="w-full max-w-5xl mx-auto px-10 pt-0 animate-fade-in"> 
            <header className="mb-4 -mt-4">
                <h1 className="text-4xl font-bold text-gray-800 mt-0 leading-tight text-left">
                    Mensajes
                </h1>
                <p className="text-gray-500 text-sm mt-2">Tus conexiones de hoy</p>
            </header>

            <main className="flex flex-col gap-4">
                <NewMatchesHorizontal />
                <ChatListVertical />
            </main>
        </div>
    );
};