import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Leaf,
  Plus,
  Search,
  Globe,
  BookOpen,
  FileText,
  Settings,
  History,
  MessageCircle,
  LayoutDashboard,
  Menu,
  X,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useConversations } from '@/hooks/useConversations';
import { toast } from 'sonner';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { conversations, createConversation } = useConversations();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleNewChat = () => {
    const newConv = createConversation();
    navigate(`/chat/${newConv.id}`);
    toast.success('New conversation started 🌿');
    setIsMobileOpen(false);
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Moodboard', path: '/dashboard' },
    { icon: MessageCircle, label: 'Chat', path: '/chat' },
    { icon: BookOpen, label: 'Journal', path: '/journal', badge: 'Soon' },
    { icon: FileText, label: 'Library', path: '/library', badge: 'Soon' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: History, label: 'History', path: '/history', badge: 'Soon' },
  ];

  const isActive = (path) => {
    if (path === '/chat') {
      return location.pathname.startsWith('/chat');
    }
    return location.pathname === path;
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else if (date > new Date(today.setDate(today.getDate() - 7))) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const groupedConversations = filteredConversations.reduce((groups, conv) => {
    const date = formatDate(conv.updatedAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(conv);
    return groups;
  }, {});

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
          <Leaf className="w-6 h-6 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold" style={{ fontFamily: 'Manrope' }}>
          SoulSync
        </h1>
      </div>

      {/* New Chat Button */}
      <div className="px-4 pb-2">
        <Button
          onClick={handleNewChat}
          className="w-full bg-primary hover:bg-primary/90 transition-smooth shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          New chat
        </Button>
      </div>

      {/* Search */}
      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary transition-smooth"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-2 space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className={`w-full justify-start transition-smooth ${
              isActive(item.path)
                ? 'bg-primary/10 text-primary hover:bg-primary/15'
                : 'hover:bg-muted'
            }`}
            onClick={() => {
              if (item.badge) {
                toast.info('Coming soon!');
              } else {
                navigate(item.path);
                setIsMobileOpen(false);
              }
            }}
            disabled={item.badge === 'Soon'}
          >
            <item.icon className="w-4 h-4 mr-3" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </Button>
        ))}
      </nav>

      <Separator className="my-2" />

      {/* Recent Chats */}
      <div className="px-4 py-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {searchQuery ? 'Search Results' : 'Recent'}
        </p>
      </div>

      <ScrollArea className="flex-1 px-2">
        {Object.keys(groupedConversations).length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedConversations).map(([date, convs]) => (
              <div key={date}>
                <p className="px-2 text-xs text-muted-foreground mb-1">{date}</p>
                <div className="space-y-1">
                  {convs.map((conv) => (
                    <Button
                      key={conv.id}
                      variant="ghost"
                      className={`w-full justify-start text-left h-auto py-2 px-3 transition-smooth ${
                        location.pathname === `/chat/${conv.id}`
                          ? 'bg-primary/10 text-primary hover:bg-primary/15'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => {
                        navigate(`/chat/${conv.id}`);
                        setIsMobileOpen(false);
                      }}
                    >
                      <div className="flex-1 truncate">
                        <p className="text-sm truncate">{conv.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {conv.messages.length} messages
                        </p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <Separator className="my-2" />

      {/* User Profile */}
      <div className="p-4">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-smooth cursor-pointer">
          <Avatar className="w-9 h-9 bg-gradient-primary">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50 bg-card shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-sm">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          className="md:hidden fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card shadow-2xl flex flex-col"
        >
          {sidebarContent}
        </motion.aside>
      )}

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
