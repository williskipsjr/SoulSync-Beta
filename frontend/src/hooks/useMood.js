import { useState, useEffect } from 'react';

// Hook for mood tracking
export const useMood = () => {
  const [moodHistory, setMoodHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load mood history from localStorage
    const stored = localStorage.getItem('soulsync_mood_history');
    if (stored) {
      try {
        setMoodHistory(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing mood history:', error);
      }
    }
    setLoading(false);
  }, []);

  const saveMood = (moodData) => {
    const entry = {
      ...moodData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    const updated = [entry, ...moodHistory];
    setMoodHistory(updated);
    localStorage.setItem('soulsync_mood_history', JSON.stringify(updated));
    return entry;
  };

  const getMoodTrend = (days = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return moodHistory
      .filter(entry => new Date(entry.timestamp) >= cutoffDate)
      .reverse();
  };

  const getAverageMood = (days = 7) => {
    const recent = getMoodTrend(days);
    if (recent.length === 0) return 5;
    
    const sum = recent.reduce((acc, entry) => acc + entry.level, 0);
    return (sum / recent.length).toFixed(1);
  };

  return {
    moodHistory,
    loading,
    saveMood,
    getMoodTrend,
    getAverageMood,
  };
};
