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

// Curated emoji categories for mental health context
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
        // Don't close picker - allow multiple emoji selection
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

            // Log FINAL CONSOLIDATED analysis as requested in STEP-6
            console.log('--- SESSION ANALYSIS ---');
            console.log('Message:', message.trim());
            console.log('Behavioral Indicators:', {
                typingStressScore,
                textEmotionScores,
                emojiEmotionScores,
                behavioralDistress,
                assistantResponse
            });

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
        <div className="border-t bg-white/80 backdrop-blur-sm p-4 relative">
            {/* Emoji Picker Popup */}
            {showEmojiPicker && (
                <div
                    ref={emojiPickerRef}
                    className="absolute bottom-full mb-2 left-4 right-4 lg:left-auto lg:right-auto lg:w-96 bg-white rounded-2xl shadow-2xl border border-indigo-100 overflow-hidden z-50 animate-scale-in"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 text-white">
                        <div className="flex items-center gap-2">
                            <Sparkles size={16} />
                            <h3 className="text-sm font-bold">Express Yourself</h3>
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-1 p-2 bg-slate-50 border-b border-slate-100 overflow-x-auto no-scrollbar">
                        {Object.keys(EMOJI_CATEGORIES).map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeCategory === category
                                        ? 'bg-indigo-500 text-white shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-200'
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
                                className="text-2xl hover:bg-indigo-50 rounded-lg p-2 transition-all transform hover:scale-125 active:scale-95"
                                title={`Add ${emoji}`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-3xl mx-auto">
                {/* Emoji Button */}
                <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`p-2 rounded-full transition-all ${showEmojiPicker
                            ? 'bg-indigo-500 text-white shadow-lg'
                            : 'text-slate-400 hover:text-indigo-500 hover:bg-indigo-50'
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
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 transition-all text-sm"
                />

                {/* Send Button */}
                <button
                    type="submit"
                    disabled={!message.trim() || isDisabled}
                    className="p-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm disabled:shadow-none group"
                    aria-label="Send message"
                >
                    <Send size={20} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
            </form>
        </div>
    );
};
