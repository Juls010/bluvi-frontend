import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';

type Message = {
    id: number;
    text: string;
    from: 'blu' | 'user';
};

const SUGGESTIONS = [
    "¿Cómo rompo el hielo?",
    "Revisa mi perfil",
    "¿Con quién hablo primero?",
];

const BLU_RESPONSES: Record<string, string> = {
    "¿Cómo rompo el hielo?": "¡Pregunta algo sobre una foto de su perfil! Las preguntas específicas generan 3x más respuestas que un simple 'hola' 💬",
    "Revisa mi perfil": "Tu perfil tiene buena energía ✨ Te sugiero añadir una foto al aire libre y mencionar un hobby concreto en tu bio.",
    "¿Con quién hablo primero?": "Empieza con alguien con quien compartas al menos 2 intereses. La compatibilidad de hobbies predice mejor la conexión real 🎯",
};

export const BluAssistant: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 0, text: '¡Hola! Soy Blu, tu asistente de citas 💜 ¿En qué te ayudo?', from: 'blu' },
    ]);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typing]);

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 300);
    }, [open]);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;
        const userMsg: Message = { id: Date.now(), text, from: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setTyping(true);

        setTimeout(() => {
            const reply = BLU_RESPONSES[text] ?? "Interesante... déjame pensarlo 🤔 Aún estoy aprendiendo de ti.";
            setTyping(false);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, from: 'blu' }]);
        }, 1400);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

            {/* ── PANEL ── */}
            <div
                className="flex flex-col overflow-hidden rounded-3xl shadow-2xl border border-white/40"
                style={{
                    width: '320px',
                    maxHeight: open ? '480px' : '0px',
                    opacity: open ? 1 : 0,
                    transition: 'max-height 0.55s ease-in-out, opacity 0.45s ease-in-out',
                    pointerEvents: open ? 'auto' : 'none',
                    background: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-purple-50"
                    style={{ background: 'linear-gradient(135deg, #f3f0ff 0%, #fce7f3 100%)' }}
                >
                    <div className="flex items-center gap-2.5">
                        <div className="relative">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-md"
                                style={{ background: 'linear-gradient(135deg, #9160e4, #3b2b97)' }}
                            >
                                <Sparkles size={16} className="text-white" />
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full ring-2 ring-white" />
                        </div>
                        <div>
                            <p className="text-[13px] font-bold text-bluvi-purple leading-none">Blu</p>
                            <p className="text-[10px] text-green-500 font-medium mt-0.5">Asistente activo</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="w-7 h-7 flex items-center justify-center rounded-full text-bluvi-purple/40 hover:text-bluvi-purple hover:bg-purple-100 transition-all"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2" style={{ maxHeight: '280px' }}>
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`
                                px-3.5 py-2 rounded-2xl text-[13px] leading-relaxed max-w-[82%]
                                ${msg.from === 'user'
                                    ? 'text-white rounded-br-sm'
                                    : 'bg-white/90 text-gray-700 border border-purple-50 shadow-sm rounded-bl-sm'
                                }
                            `}
                                style={msg.from === 'user' ? {
                                    background: 'linear-gradient(135deg, #7c3aed, #9333ea)'
                                } : {}}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator — fade suave, sin rebote */}
                    {typing && (
                        <div className="flex justify-start">
                            <div className="bg-white/90 border border-purple-50 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                                {[0, 1, 2].map(i => (
                                    <span key={i} className="w-1.5 h-1.5 bg-bluvi-purple/40 rounded-full"
                                        style={{
                                            animation: 'gentleFade 1.8s ease-in-out infinite',
                                            animationDelay: `${i * 0.35}s`
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Suggestions */}
                {messages.length <= 1 && (
                    <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                        {SUGGESTIONS.map(s => (
                            <button key={s}
                                onClick={() => sendMessage(s)}
                                className="text-[11px] px-3 py-1.5 rounded-full border border-purple-200 text-bluvi-purple/70 hover:bg-purple-50 hover:text-bluvi-purple hover:border-purple-300 transition-all"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input */}
                <div className="px-3 pb-3 pt-1 border-t border-purple-50/60">
                    <div className="flex items-center gap-2 bg-white/80 border border-purple-100 rounded-2xl px-3 py-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                            placeholder="Pregúntale a Blu..."
                            className="flex-1 bg-transparent text-[13px] text-bluvi-purple placeholder:text-bluvi-purple/30 outline-none"
                        />
                        <button
                            onClick={() => sendMessage(input)}
                            disabled={!input.trim()}
                            className={`w-7 h-7 flex items-center justify-center rounded-full transition-all ${input.trim() ? 'text-white shadow-sm' : 'text-bluvi-purple/20'}`}
                            style={input.trim() ? { background: 'linear-gradient(135deg, #7c3aed, #9333ea)' } : {}}
                        >
                            <Send size={13} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── FAB BUTTON ── */}
            <button
                onClick={() => setOpen(o => !o)}
                className="relative w-14 h-14 rounded-full shadow-xl flex items-center justify-center"
                style={{
                    background: 'linear-gradient(135deg, #9160e4, #3b2b97)',
                    boxShadow: '0 6px 24px rgba(124, 58, 237, 0.3)',
                    // Transición suave solo de opacidad — sin escala, sin rebote
                    transition: 'opacity 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
                {/* Icono: fade cruzado en lugar de rotación */}
                <div style={{ transition: 'opacity 0.3s ease', opacity: open ? 0 : 1, position: 'absolute' }}>
                    <Sparkles size={22} className="text-white" />
                </div>
                <div style={{ transition: 'opacity 0.3s ease', opacity: open ? 1 : 0, position: 'absolute' }}>
                    <X size={22} className="text-white" />
                </div>

            </button>

            <style>{`
                @keyframes gentleFade {
                    0%, 100% { opacity: 0.25; }
                    50%       { opacity: 0.75; }
                }
            `}</style>
        </div>
    );
};