import React from 'react';
import type { Message } from '../types/chat';

interface ChatMessageProps {
    message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isAssistant = message.role === 'assistant';

    return (
        <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} mb-4 animate-fade-in`}>
            <div className={`max-w-[85%] lg:max-w-[75%] px-4 py-3 rounded-2xl ${isAssistant
                ? 'bg-brand-light text-brand-dark rounded-tl-none border border-brand-medium/30'
                : 'bg-brand-primary text-white rounded-tr-none shadow-md shadow-brand-primary/10'
                }`}>
                <div className="text-sm leading-relaxed whitespace-pre-wrap font-bold">
                    {message.content}
                </div>
                <div className={`text-[10px] mt-1.5 font-bold uppercase tracking-wider ${isAssistant ? 'text-brand-medium' : 'text-white/60'}`}>
                    {message.timestamp}
                </div>
            </div>
        </div>
    );
};
