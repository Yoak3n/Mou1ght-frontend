import type { FC } from 'react';
import { MessageInfo } from '@/types/post';

interface NoteProps {
    message: MessageInfo;
    index: number;
}

const COLORS = [
    'bg-yellow-100',
    'bg-green-100',
    'bg-blue-100',
    'bg-pink-100',
    'bg-orange-100',
];

const Note: FC<NoteProps> = ({ message, index }) => {
    // Deterministic random based on ID or index
    const messageId = message.id || '';
    const colorIndex = (messageId.length + index) % COLORS.length;
    
    // Generate stable rotation from ID hash
    const hash = messageId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const rotate = (hash % 10) - 5; // -5 to +4 degrees 

    return (
        <div 
            className={`
                ${COLORS[colorIndex]} 
                p-6 w-64 h-64 shadow-md 
                flex flex-col relative
                transition-transform hover:scale-105 hover:shadow-xl hover:z-10 duration-300
                group
            `}
            style={{
                transform: `rotate(${rotate}deg)`,
                fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif'
            }}
        >
            {/* Pin Graphic */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                <div className="w-3 h-3 rounded-full bg-red-600 shadow-sm border border-red-800 relative">
                     <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full opacity-50"></div>
                </div>
                <div className="w-0.5 h-2 bg-gray-400 mx-auto -mt-1"></div>
            </div>
            
            <div className="flex-1 overflow-y-auto mt-2 text-gray-800 whitespace-pre-wrap leading-relaxed custom-scrollbar">
                {message.content}
            </div>
            
            <div className="mt-4 pt-2 border-t border-black/5 text-xs text-gray-500 text-right flex justify-between items-center">
                 <span className="opacity-50">#{index + 1}</span>
                 <span>{message.time?.created_at ? new Date(message.time.created_at).toLocaleDateString() : ''}</span>
            </div>
        </div>
    );
};

export default Note;