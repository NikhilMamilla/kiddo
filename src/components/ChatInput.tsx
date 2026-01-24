import React, { useState, useRef, useEffect } from 'react';
import { Smile, Send, Sparkles } from 'lucide-react';
import { useTypingMetrics } from '../hooks/useTypingMetrics';
import type { TypingMetrics } from '../types/metrics';
import { calculateTypingStressScore } from '../utils/typingStressScorer';
import { analyzeTextEmotion } from '../utils/textAnalyzer';
import { analyzeEmojiEmotion } from '../utils/emojiEmotionAnalyzer';
import { calculateBDI } from '../utils/behavioralDistressIndex';
import { generateSupportResponse } from '../utils/supportResponseGenerator';
import type { BDIResult } from '../types/bdi';

interface ChatInputProps {
    onSendMessage: (content: string, metrics?: TypingMetrics, bdi?: BDIResult, assistantResponse?: string) => void;
    isDisabled?: boolean;
}

// Curated emoji categories for health context
const EMOJI_CATEGORIES = {
    'Feelings': ['😊', '😢', '😔', '😰', '😤', '😌', '🥺', '😭', '😟', '😞', '😣', '😖', '😫', '😩'],
    'Support': ['❤️', '💙', '💚', '💛', '💜', '🤗', '🫂', '💪', '🙏', '✨', '🌟', '☀️', '🌈', '🌺'],
    'Mood': ['😃', '🙂', '😐', '😕', '😢', '😡', '😨', '😱', '😴', '🤔', '😪', '😮‍💨', '😤', '🥱'],
    'Daily': ['☕', '📚', '💼', '🏃', '🧘', '🎵', '🎨', '🌙', '🛌', '🍕', '🌱', '📝', '💻', '📱']
};

export const ChatInput: React.FC<ChatInputProps> = ({
    onSendMessage,
    isDisabled = false
}) => {
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string>('Feelings');
    const { registerKeyPress, resetMetrics, getMetrics } = useTypingMetrics();
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };

        if (showEmojiPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showEmojiPicker]);

    const handleEmojiClick = (emoji: string) => {
        const newMessage = message + emoji;
        setMessage(newMessage);
        inputRef.current?.focus();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !isDisabled) {
            const metrics = getMetrics();
            const typingStressScore = calculateTypingStressScore(metrics);
            const textEmotionScores = analyzeTextEmotion(message.trim());
            const emojiEmotionScores = analyzeEmojiEmotion(message.trim());
            const behavioralDistress = calculateBDI(typingStressScore, textEmotionScores, emojiEmotionScores);
            const assistantResponse = generateSupportResponse(behavioralDistress);

            onSendMessage(message.trim(), metrics, behavioralDistress, assistantResponse);
            setMessage('');
            resetMetrics();
            setShowEmojiPicker(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        registerKeyPress(e);
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(e);
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm p-2 sm:p-4 relative">
            {/* Emoji Picker Popup */}
            {showEmojiPicker && (
                <div
                    ref={emojiPickerRef}
                    className="absolute bottom-full mb-2 left-2 right-2 sm:left-4 sm:right-4 lg:left-auto lg:right-auto lg:w-96 bg-white rounded-2xl shadow-2xl border border-brand-light overflow-hidden z-50 animate-scale-in"
                >
                    {/* Header */}
                    <div className="bg-brand-primary p-3 text-white">
                        <div className="flex items-center gap-2">
                            <Sparkles size={16} />
                            <h3 className="text-sm text-white font-bold uppercase tracking-wider">Express Yourself</h3>
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-1 p-2 bg-brand-light/20 border-b border-brand-light overflow-x-auto no-scrollbar">
                        {Object.keys(EMOJI_CATEGORIES).map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeCategory === category
                                    ? 'bg-brand-primary text-white shadow-sm'
                                    : 'text-brand-medium hover:bg-brand-light'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Emoji Grid */}
                    <div className="p-3 grid grid-cols-7 gap-2 max-h-48 overflow-y-auto">
                        {EMOJI_CATEGORIES[activeCategory as keyof typeof EMOJI_CATEGORIES].map((emoji, index) => (
                            <button
                                key={index}
                                onClick={() => handleEmojiClick(emoji)}
                                className="text-2xl hover:bg-brand-light rounded-lg p-2 transition-all transform hover:scale-125 active:scale-95"
                                title={`Add ${emoji}`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-3xl mx-auto w-full">
                {/* Emoji Button */}
                <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`p-2 rounded-full transition-all shrink-0 ${showEmojiPicker
                        ? 'bg-brand-primary text-white shadow-lg'
                        : 'text-brand-medium hover:text-brand-primary hover:bg-brand-light'
                        }`}
                    aria-label="Open emoji picker"
                >
                    <Smile size={20} />
                </button>

                {/* Text Input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    disabled={isDisabled}
                    className="flex-1 w-full min-w-0 px-4 py-2.5 border border-brand-medium rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary disabled:opacity-50 transition-all text-sm font-medium placeholder-brand-medium"
                />

                {/* Send Button */}
                <button
                    type="submit"
                    disabled={!message.trim() || isDisabled}
                    className="p-2.5 bg-brand-primary text-white rounded-full hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-primary/20 disabled:shadow-none group shrink-0"
                    aria-label="Send message"
                >
                    <Send size={20} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
            </form>
        </div>
    );
};
