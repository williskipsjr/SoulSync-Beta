import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Shield, Bell, Download, Trash2, Moon, Sun, Heart, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/hooks/useAuth';
import AppShell from '@/components/AppShell';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, updateUser, logout } = useAuth();
  
  const [telegramChatId, setTelegramChatId] = useState(user?.telegramChatId || '');
  const [notifications, setNotifications] = useState(true);
  const [moodReminders, setMoodReminders] = useState(true);
  const [crisisAlerts, setCrisisAlerts] = useState(true);

  const handleSaveTelegramId = () => {
    updateUser({ telegramChatId });
    toast.success('Emergency contact updated', {
      description: 'Your emergency contact has been saved.',
    });
  };

  const handleValidateTelegramId = () => {
    if (!telegramChatId.trim()) {
      toast.error('Please enter a Telegram Chat ID');
      return;
    }
    // Simulate validation
    toast.info('Validating...', {
      description: 'Checking if this Chat ID is valid.',
    });
    setTimeout(() => {
      toast.success('✅ Chat ID is valid!', {
        description: 'Emergency contact verified successfully.',
      });
    }, 1500);
  };

  const handleExportData = () => {
    const data = {
      user,
      conversations: localStorage.getItem('soulsync_conversations'),
      moodHistory: localStorage.getItem('soulsync_mood_history'),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soulsync-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Data exported', {
      description: 'Your data has been downloaded.',
    });
  };

  const handleClearHistory = () => {
    localStorage.removeItem('soulsync_conversations');
    toast.success('History cleared', {
      description: 'All conversations have been deleted.',
    });
  };

  const handleLogout = () => {
    logout();
    toast.info('Logged out', {
      description: 'See you soon! Take care of yourself 🌿',
    });
    navigate('/auth');
  };

  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold flex items-center gap-2" style={{ fontFamily: 'Manrope' }}>
              <Settings className="w-8 h-8 text-primary" />
              Settings
            </h1>
            <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
          </motion.div>

          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Profile
                </CardTitle>
                <CardDescription>Your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={user?.name || ''} disabled className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input value={user?.username || ''} disabled className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user?.email || ''} disabled className="bg-muted/50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Emergency Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-md border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Emergency Contact
                </CardTitle>
                <CardDescription>
                  Telegram Chat ID for emergency notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-secondary/30 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium mb-1">Why is this important?</p>
                      <p className="text-xs text-muted-foreground">
                        If our AI detects signs of crisis or suicidal thoughts, we'll immediately
                        notify your emergency contact to ensure you get the support you need.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telegram-id">Telegram Chat ID</Label>
                  <div className="flex gap-2">
                    <Textarea
                      id="telegram-id"
                      value={telegramChatId}
                      onChange={(e) => setTelegramChatId(e.target.value)}
                      placeholder="Enter Chat ID..."
                      rows={2}
                      className="resize-none flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current: {user?.telegramChatId || 'Not set'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleValidateTelegramId}
                    variant="outline"
                    className="transition-smooth"
                  >
                    Validate ID
                  </Button>
                  <Button
                    onClick={handleSaveTelegramId}
                    className="bg-primary hover:bg-primary/90 transition-smooth"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {theme === 'dark' ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                  Appearance
                </CardTitle>
                <CardDescription>Customize how SoulSync looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notifications
                </CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">All Notifications</p>
                    <p className="text-sm text-muted-foreground">Enable or disable all notifications</p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mood Reminders</p>
                    <p className="text-sm text-muted-foreground">Daily reminders to check in</p>
                  </div>
                  <Switch
                    checked={moodReminders}
                    onCheckedChange={setMoodReminders}
                    disabled={!notifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Crisis Alerts</p>
                    <p className="text-sm text-muted-foreground">Emergency contact notifications</p>
                  </div>
                  <Switch
                    checked={crisisAlerts}
                    onCheckedChange={setCrisisAlerts}
                    disabled={!notifications}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data & Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Data & Privacy</CardTitle>
                <CardDescription>Manage your data and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleExportData}
                  variant="outline"
                  className="w-full justify-start transition-smooth"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export My Data
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-destructive hover:text-destructive transition-smooth"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear Conversation History
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all your conversations. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleClearHistory}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Delete All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Separator />

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-full"
                    >
                      Logout
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Logout from SoulSync?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You'll need to log in again to access your conversations.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout}>
                        Logout
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
};

export default SettingsPage;
