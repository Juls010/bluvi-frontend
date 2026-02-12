import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Check, MoreVertical, Image, Smile } from 'lucide-react';
import EmojiPicker, { type EmojiClickData, Theme } from 'emoji-picker-react';

export const ChatDetail: React.FC = () => {
    const navigate = useNavigate();
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [messages] = useState([
        { id: 1, text: "Holaa! ✌️", sender: 'me', time: '12:41' },
        { id: 2, text: "Holii 😊", sender: 'them', time: '12:42' },
        { id: 3, text: "He visto en tu perfil que te gusta la fotografía...", sender: 'them', time: '12:43' },
        { id: 4, text: "¡Sí! Llevo un par de años con ello, sobre todo fotografía de paisajes 🌄", sender: 'me', time: '12:44' },
        { id: 5, text: "Qué bonito! Yo también me apuntaría, pero creo que no tengo el ojo artístico jaja", sender: 'them', time: '12:45' },
    ]);

    const [showPicker, setShowPicker] = useState<boolean>(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleEmojiClick = (emojiData: EmojiClickData): void => {
        setInputText((prev: string) => prev + emojiData.emoji);
        setShowPicker(false);
        inputRef.current?.focus();
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex justify-center h-[100svh]">
        <div className="flex flex-col w-full max-w-[95%]">

            {/* ── HEADER ── */}
            <header className="flex-none z-50 bg-white/50  backdrop-blur-xl border-b rounded-2xl border-purple-100/60 px-5 py-3 flex items-center justify-between shadow-sm shadow-purple-100/40">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-purple-50 text-bluvi-purple transition-all active:scale-90"
                    >
                        <ArrowLeft size={22} strokeWidth={2} />
                    </button>

                    <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100"
                                className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-200"
                                alt="Lucila"
                            />
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full ring-2 ring-white" />
                        </div>
                        <div className="text-left">
                            <h2 className="text-[15px] font-semibold text-bluvi-purple leading-tight">Lucila López</h2>
                            <span className="text-[11px] text-green-500 font-medium">En línea</span>
                        </div>
                    </button>
                </div>

                <div className="flex items-center gap-1">
                    <button className="w-9 h-9 flex items-center justify-center rounded-full text-bluvi-purple/50 hover:bg-purple-50 hover:text-bluvi-purple transition-all active:scale-90">
                        <MoreVertical size={20} strokeWidth={1.8} />
                    </button>
                </div>
            </header>

            <main className="flex-1 min-h-0 overflow-y-auto px-5 py-6 space-y-2">

                <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-purple-100/70" />
                    <span className="text-[11px] text-bluvi-purple/40 font-medium tracking-wide uppercase">Hoy</span>
                    <div className="flex-1 h-px bg-purple-100/70" />
                </div>

                {messages.map((msg, i) => {
                    const isMe = msg.sender === 'me';
                    const prevMsg = messages[i - 1];
                    const isSameSender = prevMsg?.sender === msg.sender;

                    return (
                        <div
                            key={msg.id}
                            className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'} ${isSameSender ? 'mt-1' : 'mt-3'}`}
                        >
                            {!isMe && (
                                <div className="w-7 flex-none">
                                    {(!messages[i + 1] || messages[i + 1].sender !== 'them') && (
                                        <img
                                            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100"
                                            className="w-7 h-7 rounded-full object-cover ring-1 ring-purple-100"
                                            alt="Lucila"
                                        />
                                    )}
                                </div>
                            )}

                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                <div className={`
                                    px-4 py-2.5 text-[14.5px] leading-relaxed
                                    ${isMe
                                        ? 'bg-bluvi-purple text-white rounded-2xl rounded-br-md shadow-md shadow-bluvi-purple/25'
                                        : 'bg-white/80 text-gray-700 rounded-2xl rounded-bl-md shadow-sm shadow-purple-100/60 border border-purple-50'
                                    }
                                `}>
                                    {msg.text}
                                </div>

                                <div className="flex items-center gap-1 mt-1 px-1">
                                    <span className="text-[10px] text-bluvi-purple/30">{msg.time}</span>
                                    {isMe && (
                                        <span className="flex">
                                            <Check size={11} className="text-bluvi-purple/40" />
                                            <Check size={11} className="text-bluvi-purple/40 -ml-1.5" />
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                <div ref={messagesEndRef} />
            </main>

            <div className="flex-none px-4 pb-6 pt-2 bg-white/60 backdrop-blur-xl rounded-2xl  border-t border-purple-50">
                <div className="flex items-end gap-2">

                    <div className="flex gap-1 pb-2">
                        <button className="w-9 h-9 flex items-center justify-center text-bluvi-purple/40 hover:text-bluvi-purple hover:bg-purple-50 rounded-full transition-all active:scale-90">
                            <Image size={20} strokeWidth={1.8} />
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setShowPicker((o: boolean) => !o)}
                                className="w-9 h-9 flex items-center justify-center text-bluvi-purple/40 hover:text-bluvi-purple hover:bg-purple-50 rounded-full transition-all active:scale-90"
                            >
                                <Smile size={20} strokeWidth={1.8} />
                            </button>

                            {showPicker && (
                                <div className="absolute bottom-12 left-0 z-50">
                                    <EmojiPicker
                                        onEmojiClick={handleEmojiClick}
                                        theme={Theme.LIGHT}
                                        lazyLoadEmojis={true}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 bg-white/90 border border-purple-100 rounded-2xl px-4 py-2.5 shadow-sm flex items-end gap-2">
                        <textarea
                            rows={1}
                            placeholder="Escribe un mensaje..."
                            value={inputText}
                            onChange={e => {
                                setInputText(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                            }}
                            className="flex-1 bg-transparent outline-none text-bluvi-purple placeholder:text-bluvi-purple/30 text-[14px] resize-none leading-relaxed max-h-[120px] overflow-y-auto"
                            style={{ minHeight: '24px' }}
                        />
                    </div>

                    <button
                        className={`w-11 h-11 flex items-center justify-center rounded-full shadow-md transition-all active:scale-90 ${inputText.trim() ? 'bg-bluvi-purple text-white shadow-bluvi-purple/30' : 'bg-purple-100 text-bluvi-purple/40'}`}
                        disabled={!inputText.trim()}
                    >
                        <Send size={18} strokeWidth={2} className={inputText.trim() ? 'translate-x-0.5 -translate-y-0.5' : ''} />
                    </button>
                </div>
            </div>

        </div>
        </div>
    );
};