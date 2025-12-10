import React from 'react';
import { motion } from 'framer-motion';
import { Heart, User } from 'lucide-react';

export const MessageBubble = ({ message, isLast }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-muted' : 'bg-gradient-primary shadow-md'
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-foreground" />
        ) : (
          <Heart className="w-5 h-5 text-primary-foreground" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={`max-w-[70%] px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-muted rounded-tr-sm'
            : 'bg-card border border-primary/10 shadow-sm rounded-tl-sm'
        }`}
      >
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {new Date(message.timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })}
        </p>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
