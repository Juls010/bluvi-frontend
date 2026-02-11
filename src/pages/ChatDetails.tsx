import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Check, Settings } from 'lucide-react';
import { Button } from '../../components/Button';

export const ChatDetail: React.FC = () => {
    const navigate = useNavigate();
    const [inputText, setInputText] = useState('');

    const [messages] = useState([
        { id: 1, text: "Holaa! ✌️", sender: 'me' },
        { id: 2, text: "Holii 😊", sender: 'them' },
        { id: 3, text: "He visto en tu perfil que te gusta la fotografía...", sender: 'them' },
    ]);

    return (
    <div className="min-h-screen pb-20 bg-transparent"> 

        <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/20 px-12 py-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-6">
                <button onClick={() => navigate(-1)} className="text-bluvi-purple hover:scale-110 transition-transform">
                    <ArrowLeft size={28} strokeWidth={1.5} />
                </button>
                <div className="flex items-center gap-4">
                    <img 
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100" 
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" 
                        alt="Lucila" 
                    />
                    <div>
                        <h2 className="text-xl font-bold text-bluvi-purple/90">Lucila López Quesada</h2>
                        <span className="text-xs text-green-500 font-medium">En línea</span>
                    </div>
                </div>
            </div>
            <button className="p-2 hover:bg-white/50 rounded-full transition-colors">
                <Settings size={22} className="text-bluvi-purple/60" />
            </button>
        </header>

        <main className="max-w-4xl mx-auto px-12 py-10 space-y-8">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`
                        max-w-[70%] p-5 rounded-[2.2rem] shadow-sm backdrop-blur-sm border
                        ${msg.sender === 'me' 
                            ? 'bg-bluvi-purple/15 border-bluvi-purple/20 text-bluvi-purple rounded-tr-none' 
                            : 'bg-white/60 border-white text-gray-700 rounded-tl-none'}
                    `}>
                        <p className="text-[15px] leading-relaxed">{msg.text}</p>
                        
                        {msg.sender === 'me' && (
                            <div className="flex justify-end mt-2 mr-1 opacity-60">
                                <Check size={14} className="text-bluvi-purple" />
                                <Check size={14} className="text-bluvi-purple -ml-2" />
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </main>

        <div className="sticky bottom-10 left-0 right-0 px-12">
            <div className="max-w-3xl mx-auto bg-white/50 backdrop-blur-lg border border-white/60 rounded-full p-2.5 flex items-center shadow-2xl shadow-purple-900/5">
                <input 
                    type="text"
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-transparent px-6 py-3 outline-none text-bluvi-purple placeholder:text-bluvi-purple/40 font-medium text-sm"
                />
                <button className="bg-bluvi-purple text-white p-4 rounded-full hover:scale-110 active:scale-95 transition-all shadow-lg">
                    <Send size={20} strokeWidth={2} />
                </button>
            </div>
        </div>
    </div>
    );
};