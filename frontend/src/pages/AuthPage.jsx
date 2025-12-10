import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, signup, isAuthenticated, user, loading: authLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form
  const [signupName, setSignupName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Wait for auth loading to complete before redirecting
    if (authLoading) return;
    
    if (isAuthenticated && user?.onboardingComplete) {
      navigate('/dashboard');
    } else if (isAuthenticated && !user?.onboardingComplete) {
      navigate('/onboarding');
    }
  }, [isAuthenticated, user, navigate, authLoading]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login
    setTimeout(() => {
      const userData = {
        email: loginEmail,
        name: loginEmail.split('@')[0],
        username: loginEmail.split('@')[0],
        telegramChatId: '', // Will be set in onboarding
        onboardingComplete: false,
      };
      
      login(userData);
      toast.success('Welcome back! 🌿', {
        description: 'You\'re safe here.',
      });
      setLoading(false);
      // Navigation handled by useEffect based on onboardingComplete status
    }, 1000);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!telegramChatId.trim()) {
      toast.error('Emergency contact required', {
        description: 'Please enter your emergency contact\'s Telegram Chat ID for safety.',
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate signup
    setTimeout(() => {
      const userData = {
        name: signupName,
        username: signupUsername,
        email: signupEmail,
        telegramChatId: telegramChatId,
        onboardingComplete: false,
        createdAt: new Date().toISOString(),
      };
      
      signup(userData);
      toast.success('Account created! 🌱', {
        description: 'Let\'s complete your wellness profile.',
      });
      setLoading(false);
      // Navigation handled by useEffect based on onboardingComplete status
    }, 1000);
  };

  // Show loading screen while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-calm">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-elegant mx-auto mb-4 animate-pulse">
            <Leaf className="w-7 h-7 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-calm p-4">
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 text-primary/20"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Leaf size={60} />
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-10 text-primary/20"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart size={50} />
        </motion.div>
        <motion.div
          className="absolute top-1/3 right-1/4 text-accent/20"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={40} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center gap-2 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-elegant">
              <Leaf className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Manrope' }}>
              SoulSync
            </h1>
          </motion.div>
          <p className="text-muted-foreground text-sm">
            Your safe space for mental wellness
          </p>
        </div>

        <Card className="shadow-xl border-2 border-primary/10">
          <Tabs value={isLogin ? 'login' : 'signup'} onValueChange={(v) => setIsLogin(v === 'login')} className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="transition-smooth"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="transition-smooth"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 transition-smooth"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                      className="transition-smooth"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      id="signup-username"
                      type="text"
                      placeholder="johndoe"
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      required
                      className="transition-smooth"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className="transition-smooth"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      className="transition-smooth"
                    />
                  </div>
                  
                  <div className="space-y-2 p-4 bg-secondary/50 rounded-lg border border-primary/20">
                    <Label htmlFor="telegram-chat-id" className="text-sm font-semibold flex items-center gap-2">
                      <Heart className="w-4 h-4 text-primary" />
                      Emergency Contact (Telegram Chat ID)
                    </Label>
                    <Textarea
                      id="telegram-chat-id"
                      placeholder="Enter your emergency contact's Telegram Chat ID"
                      value={telegramChatId}
                      onChange={(e) => setTelegramChatId(e.target.value)}
                      required
                      rows={2}
                      className="transition-smooth resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      We'll contact this person only in emergency situations for your safety.
                    </p>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 transition-smooth"
                    disabled={loading}
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
