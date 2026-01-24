import React, { useRef, useEffect } from 'react';
import type { Message } from '../types/chat';
import type { TypingMetrics } from '../types/metrics';
import type { BDIResult } from '../types/bdi';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

export interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (content: string, metrics?: TypingMetrics, bdi?: BDIResult, assistantResponse?: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth no-scrollbar"
            >
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-brand-light">
                <ChatInput onSendMessage={onSendMessage} isDisabled={false} />
            </div>
        </div>
    );
};
