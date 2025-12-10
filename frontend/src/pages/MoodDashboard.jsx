import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smile, Meh, Frown, Heart, TrendingUp, MessageCircle, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useMood } from '@/hooks/useMood';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AppShell from '@/components/AppShell';

const EMOTION_TAGS = [
  { label: 'Happy', icon: '😊', color: 'bg-success/20 text-success' },
  { label: 'Calm', icon: '🧘', color: 'bg-primary/20 text-primary' },
  { label: 'Anxious', icon: '😟', color: 'bg-warning/20 text-warning' },
  { label: 'Sad', icon: '😢', color: 'bg-destructive/20 text-destructive' },
  { label: 'Stressed', icon: '😵', color: 'bg-chart-4/20 text-chart-4' },
  { label: 'Excited', icon: '✨', color: 'bg-chart-3/20 text-chart-3' },
  { label: 'Lonely', icon: '💔', color: 'bg-muted text-muted-foreground' },
  { label: 'Grateful', icon: '🙏', color: 'bg-accent/20 text-accent' },
];

const WELLNESS_TIPS = [
  { title: '5-Minute Breathing Exercise', description: 'Take deep breaths: inhale for 4, hold for 7, exhale for 8.' },
  { title: 'Gratitude Practice', description: 'Write down 3 things you\'re grateful for today.' },
  { title: 'Mindful Walk', description: 'Take a 10-minute walk and focus on your surroundings.' },
  { title: 'Hydration Check', description: 'Drink a glass of water and notice how you feel.' },
  { title: 'Connect with Someone', description: 'Send a message to a friend or loved one.' },
];

const MoodDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { moodHistory, saveMood, getMoodTrend, getAverageMood } = useMood();
  
  const [moodLevel, setMoodLevel] = useState([5]);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [note, setNote] = useState('');
  const [showCheckin, setShowCheckin] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    // Wait for auth loading to complete before redirecting
    if (authLoading) return;
    
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate, authLoading]);

  useEffect(() => {
    // Auto-rotate wellness tips
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % WELLNESS_TIPS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveMood = () => {
    const moodData = {
      level: moodLevel[0],
      emotions: selectedEmotions,
      note: note.trim(),
    };
    
    saveMood(moodData);
    toast.success('Mood saved! 🌿', {
      description: 'Keep tracking to see your progress.',
    });
    
    setShowCheckin(false);
    setNote('');
    setSelectedEmotions([]);
    setMoodLevel([5]);
  };

  const toggleEmotion = (emotion) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion)
        ? prev.filter((e) => e !== emotion)
        : [...prev, emotion]
    );
  };

  const getMoodIcon = (level) => {
    if (level >= 7) return <Smile className="w-6 h-6 text-success" />;
    if (level >= 4) return <Meh className="w-6 h-6 text-warning" />;
    return <Frown className="w-6 h-6 text-destructive" />;
  };

  const chartData = getMoodTrend(7).map((entry) => ({
    date: new Date(entry.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
    mood: entry.level,
  }));

  const averageMood = getAverageMood(7);

  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-bold" style={{ fontFamily: 'Manrope' }}>
              Welcome back, {user?.name?.split(' ')[0] || 'Friend'} 🌿
            </h1>
            <p className="text-muted-foreground">
              How are you feeling today?
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mood Check-in Card */}
            {showCheckin && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-2"
              >
                <Card className="border-2 border-primary/20 shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-primary" />
                      Daily Mood Check-In
                    </CardTitle>
                    <CardDescription>
                      Take a moment to reflect on how you're feeling
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Mood Slider */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Mood Level</label>
                        <div className="flex items-center gap-2">
                          {getMoodIcon(moodLevel[0])}
                          <span className="text-2xl font-bold text-primary">
                            {moodLevel[0]}/10
                          </span>
                        </div>
                      </div>
                      <Slider
                        value={moodLevel}
                        onValueChange={setMoodLevel}
                        min={1}
                        max={10}
                        step={1}
                        className="cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Very Low</span>
                        <span>Neutral</span>
                        <span>Very High</span>
                      </div>
                    </div>

                    {/* Emotion Tags */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">How are you feeling?</label>
                      <div className="flex flex-wrap gap-2">
                        {EMOTION_TAGS.map((emotion) => (
                          <Badge
                            key={emotion.label}
                            className={`cursor-pointer transition-smooth px-3 py-2 ${
                              selectedEmotions.includes(emotion.label)
                                ? emotion.color + ' border-2'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                            onClick={() => toggleEmotion(emotion.label)}
                          >
                            <span className="mr-1">{emotion.icon}</span>
                            {emotion.label}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Note */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Notes (Optional)</label>
                      <Textarea
                        placeholder="What's on your mind? You're safe here..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        className="resize-none transition-smooth"
                      />
                    </div>

                    <Button
                      onClick={handleSaveMood}
                      className="w-full bg-primary hover:bg-primary/90 transition-smooth"
                      size="lg"
                    >
                      Save Mood
                      <Heart className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Stats Cards */}
            <div className="space-y-4">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      7-Day Average
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">
                      {averageMood}/10
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {averageMood >= 7 ? 'Doing great! 🌟' : averageMood >= 5 ? 'Hang in there 🌿' : 'We\'re here for you 🤗'}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <Card className="shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Check-ins
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">
                      {moodHistory.length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total mood entries
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <Card className="shadow-md bg-gradient-primary text-primary-foreground border-0">
                  <CardContent className="pt-6">
                    <Button
                      onClick={() => navigate('/chat')}
                      className="w-full bg-card/20 hover:bg-card/30 text-primary-foreground border border-primary-foreground/20 transition-smooth"
                      size="lg"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Start Chatting
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Mood History Chart */}
          {chartData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Mood Trend (Last 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12}
                        domain={[0, 10]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="mood"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))', r: 6 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Wellness Tips Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="shadow-md bg-gradient-secondary border-primary/10">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Wellness Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  key={currentTip}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <h4 className="font-semibold mb-1">{WELLNESS_TIPS[currentTip].title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {WELLNESS_TIPS[currentTip].description}
                  </p>
                </motion.div>
                <div className="flex gap-1 mt-4">
                  {WELLNESS_TIPS.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1 flex-1 rounded-full transition-smooth ${
                        idx === currentTip ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
};

export default MoodDashboard;
