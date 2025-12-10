import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Mic, MoreVertical, AlertCircle, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useConversations } from '@/hooks/useConversations';
import AppShell from '@/components/AppShell';
import MessageBubble from '@/components/MessageBubble';
import CrisisBanner from '@/components/CrisisBanner';
import GlowingOrb from '@/components/GlowingOrb';

const QUICK_PROMPTS = [
  { icon: '💚', text: 'Emotional Support', prompt: 'I need someone to talk to about how I\'m feeling' },
  { icon: '🧘', text: 'Coping Strategies', prompt: 'Can you help me with strategies to cope with stress?' },
  { icon: '📝', text: 'Reflection', prompt: 'Help me reflect on my thoughts and feelings' },
];

const SAVED_PROMPTS = [
  { icon: '🌿', title: 'Grounding Exercise', description: '5-4-3-2-1 sensory technique', prompt: 'Can you guide me through a grounding exercise?' },
  { icon: '💭', title: 'Mood Check', description: 'Reflect on current state', prompt: 'Help me understand how I\'m feeling right now' },
  { icon: '✍️', title: 'Journaling Starter', description: 'Begin self-reflection', prompt: 'Give me a journaling prompt to explore my emotions' },
];

const ChatPage = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const {
    conversations,
    currentConversation,
    createConversation,
    addMessage,
    getConversation,
    setCurrentConversation,
  } = useConversations();
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCrisisBanner, setShowCrisisBanner] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Wait for auth loading to complete before redirecting
    if (authLoading) return;
    
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate, authLoading]);

  useEffect(() => {
    if (conversationId) {
      const conv = getConversation(conversationId);
      if (conv) {
        setCurrentConversation(conv);
      }
    } else if (!currentConversation) {
      // Create new conversation if none exists
      const newConv = createConversation();
      navigate(`/chat/${newConv.id}`, { replace: true });
    }
  }, [conversationId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentConversation) return;
    
    const message = inputMessage.trim();
    setInputMessage('');
    setIsTyping(true);
    
    try {
      const aiResponse = await addMessage(currentConversation.id, message, 'user');
      
      // Check for crisis detection
      if (aiResponse?.crisisDetected) {
        setShowCrisisBanner(true);
        // Auto-hide after 10 seconds
        setTimeout(() => setShowCrisisBanner(false), 10000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    setInputMessage(prompt);
    inputRef.current?.focus();
  };

  const hasMessages = currentConversation?.messages?.length > 0;

  // Show loading screen while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-calm">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-elegant mx-auto mb-4 animate-pulse">
            <Heart className="w-7 h-7 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AppShell>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Crisis Banner */}
        <AnimatePresence>
          {showCrisisBanner && (
            <CrisisBanner onClose={() => setShowCrisisBanner(false)} />
          )}
        </AnimatePresence>

        {/* Chat Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {!hasMessages ? (
            /* Empty State - Chat Home */
            <div className="h-full flex flex-col items-center justify-center p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center space-y-6 max-w-2xl"
              >
                {/* Glowing Orb */}
                <GlowingOrb />

                {/* Greeting */}
                <div className="space-y-2">
                  <motion.h1
                    className="text-3xl md:text-4xl font-bold text-primary/70"
                    style={{ fontFamily: 'Manrope' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Hello, {user?.name?.split(' ')[0] || 'Friend'}
                  </motion.h1>
                  <motion.p
                    className="text-xl md:text-2xl text-foreground"
                    style={{ fontFamily: 'Manrope' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    How can I support you today?
                  </motion.p>
                </div>

                {/* Quick Prompt Chips */}
                <motion.div
                  className="flex flex-wrap justify-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {QUICK_PROMPTS.map((item, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className="bg-card hover:bg-primary/10 border-primary/20 transition-smooth"
                      onClick={() => handleQuickPrompt(item.prompt)}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.text}
                    </Button>
                  ))}
                </motion.div>

                {/* Saved Prompts */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {SAVED_PROMPTS.map((item, idx) => (
                    <motion.div
                      key={idx}
                      className="p-4 rounded-xl bg-gradient-secondary border border-primary/10 cursor-pointer hover:border-primary/30 hover:shadow-md transition-smooth group"
                      onClick={() => handleQuickPrompt(item.prompt)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-smooth">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          ) : (
            /* Messages View */
            <div className="max-w-4xl mx-auto p-6 space-y-4">
              {currentConversation.messages.map((message, idx) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isLast={idx === currentConversation.messages.length - 1}
                />
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="bg-card px-4 py-3 rounded-2xl rounded-tl-sm border border-primary/10 shadow-sm">
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 bg-primary rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-primary rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-primary rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto p-4">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask me anything..."
                  className="pr-24 py-6 text-base rounded-2xl border-primary/20 focus:border-primary transition-smooth"
                  disabled={isTyping}
                />
                <div className="absolute right-2 bottom-2 flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary transition-smooth"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary transition-smooth"
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="h-12 px-6 bg-primary hover:bg-primary/90 rounded-2xl transition-smooth"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center mt-2">
              SoulSync may make mistakes. Please verify important information.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default ChatPage;
