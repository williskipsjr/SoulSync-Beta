import { useState, useEffect } from 'react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Hook for managing chat conversations
export const useConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = () => {
    const stored = localStorage.getItem('soulsync_conversations');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConversations(parsed);
      } catch (error) {
        console.error('Error parsing conversations:', error);
      }
    }
    setLoading(false);
  };

  const saveConversations = (convos) => {
    localStorage.setItem('soulsync_conversations', JSON.stringify(convos));
    setConversations(convos);
  };

  const createConversation = (title = 'New Conversation') => {
    const newConvo = {
      id: `conv_${Date.now()}`,
      title,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newConvo, ...conversations];
    saveConversations(updated);
    setCurrentConversation(newConvo);
    return newConvo;
  };

  const addMessage = async (conversationId, message, role = 'user') => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      role,
      content: message,
      timestamp: new Date().toISOString(),
    };

    const updated = conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          updatedAt: new Date().toISOString(),
          // Auto-generate title from first user message
          title: conv.messages.length === 0 ? 
            message.substring(0, 50) + (message.length > 50 ? '...' : '') : 
            conv.title
        };
      }
      return conv;
    });

    saveConversations(updated);
    
    // Update currentConversation immediately to show user message
    const updatedConv = updated.find(conv => conv.id === conversationId);
    if (updatedConv && currentConversation?.id === conversationId) {
      setCurrentConversation(updatedConv);
    }

    // If user message, get AI response
    if (role === 'user') {
      try {
        // Call backend API
        const response = await fetch(`${API}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, conversation_id: conversationId }),
        });

        if (response.ok) {
          const data = await response.json();
          const aiMessage = {
            id: `msg_${Date.now()}_ai`,
            role: 'assistant',
            content: data.response || data.message || 'I\'m here to support you. How can I help?',
            timestamp: new Date().toISOString(),
            crisisDetected: data.crisis_detected || false,
          };

          const withAI = updated.map(conv => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                messages: [...conv.messages, aiMessage],
                updatedAt: new Date().toISOString(),
              };
            }
            return conv;
          });

          saveConversations(withAI);
          
          // Update currentConversation to show AI response
          const updatedWithAI = withAI.find(conv => conv.id === conversationId);
          if (updatedWithAI && currentConversation?.id === conversationId) {
            setCurrentConversation(updatedWithAI);
          }
          
          return aiMessage;
        }
      } catch (error) {
        console.error('Error getting AI response:', error);
        // Fallback supportive response
        const fallbackMessage = {
          id: `msg_${Date.now()}_ai`,
          role: 'assistant',
          content: 'I understand. I\'m here to listen and support you. Please tell me more about how you\'re feeling.',
          timestamp: new Date().toISOString(),
        };
        
        const withFallback = updated.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: [...conv.messages, fallbackMessage],
              updatedAt: new Date().toISOString(),
            };
          }
          return conv;
        });
        
        saveConversations(withFallback);
        
        // Update currentConversation to show fallback response
        const updatedWithFallback = withFallback.find(conv => conv.id === conversationId);
        if (updatedWithFallback && currentConversation?.id === conversationId) {
          setCurrentConversation(updatedWithFallback);
        }
        
        return fallbackMessage;
      }
    }

    return newMessage;
  };

  const deleteConversation = (conversationId) => {
    const updated = conversations.filter(conv => conv.id !== conversationId);
    saveConversations(updated);
    if (currentConversation?.id === conversationId) {
      setCurrentConversation(null);
    }
  };

  const renameConversation = (conversationId, newTitle) => {
    const updated = conversations.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, title: newTitle };
      }
      return conv;
    });
    saveConversations(updated);
  };

  const getConversation = (conversationId) => {
    return conversations.find(conv => conv.id === conversationId);
  };

  return {
    conversations,
    currentConversation,
    loading,
    createConversation,
    addMessage,
    deleteConversation,
    renameConversation,
    getConversation,
    setCurrentConversation,
  };
};
