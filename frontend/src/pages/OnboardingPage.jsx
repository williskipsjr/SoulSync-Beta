import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Heart, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [emergencyContactName, setEmergencyContactName] = useState(user?.emergencyContact?.name || '');
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState(user?.emergencyContact?.relationship || '');
  const [telegramChatId, setTelegramChatId] = useState(user?.emergencyContact?.telegramChatId || '');
  const [skipEmergency, setSkipEmergency] = useState(false);

  const handleContinue = () => {
    if (step === 1) {
      if (!telegramChatId.trim() && !skipEmergency) {
        toast.warning('Emergency contact recommended', {
          description: 'We strongly recommend adding an emergency contact for your safety.',
        });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Complete onboarding
      const emergencyContact = telegramChatId.trim() ? {
        name: emergencyContactName || 'Emergency Contact',
        relationship: emergencyContactRelationship || 'Not specified',
        telegramChatId: telegramChatId
      } : null;

      updateUser({ 
        emergencyContact,
        onboardingComplete: true 
      });
      toast.success('Welcome to SoulSync! 🌿', {
        description: 'Your wellness journey begins now.',
      });
      navigate('/dashboard');
    }
  };

  const handleSkip = () => {
    setSkipEmergency(true);
    setStep(2);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-calm p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-elegant">
              <Leaf className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Manrope' }}>
              SoulSync
            </h1>
          </div>
        </div>

        <Card className="shadow-xl border-2 border-primary/10">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-2">
                {[1, 2].map((s) => (
                  <div
                    key={s}
                    className={`h-2 w-20 rounded-full transition-smooth ${
                      s <= step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                Step {step} of 2
              </span>
            </div>
            <CardTitle className="text-2xl" style={{ fontFamily: 'Manrope' }}>
              {step === 1 ? 'Emergency Contact Setup' : 'Welcome to Your Safe Space'}
            </CardTitle>
            <CardDescription>
              {step === 1
                ? 'For your safety, we need an emergency contact who we can reach out to.'
                : 'You\'re all set! Let\'s begin your wellness journey.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="flex items-start gap-4 p-4 bg-secondary/30 rounded-xl border border-primary/20">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">Why do we need this?</h3>
                    <p className="text-xs text-muted-foreground">
                      If our AI detects you're in crisis or feeling suicidal, we'll send an
                      emergency alert to your trusted contact via Telegram. This is a safety
                      measure to ensure you're never alone.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Mom, Best Friend, Partner..."
                      value={emergencyContactName}
                      onChange={(e) => setEmergencyContactName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Relationship</label>
                    <input
                      type="text"
                      placeholder="e.g., Mother, Friend, Spouse..."
                      value={emergencyContactRelationship}
                      onChange={(e) => setEmergencyContactRelationship(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Heart className="w-4 h-4 text-primary" />
                      Telegram Chat ID
                    </label>
                    <Textarea
                      placeholder="Enter their Telegram Chat ID..."
                      value={telegramChatId}
                      onChange={(e) => setTelegramChatId(e.target.value)}
                      rows={2}
                      className="resize-none transition-smooth"
                    />
                    <p className="text-xs text-muted-foreground">
                      Ask your emergency contact to message @SoulSyncBot on Telegram to get their Chat ID.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleContinue}
                    className="flex-1 bg-primary hover:bg-primary/90 transition-smooth"
                    disabled={!telegramChatId.trim()}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    onClick={handleSkip}
                    variant="outline"
                    className="transition-smooth"
                  >
                    Skip for now
                  </Button>
                </div>

                {!telegramChatId.trim() && (
                  <p className="text-xs text-center text-destructive">
                    ⚠️ Skipping this may limit our ability to help you in emergencies
                  </p>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="grid gap-4">
                  {[
                    {
                      icon: Heart,
                      title: 'Emotional Support',
                      description: 'AI-powered conversations trained on mental health therapy',
                    },
                    {
                      icon: Shield,
                      title: 'Crisis Detection',
                      description: 'Automatic emergency alerts when you need help most',
                    },
                    {
                      icon: Leaf,
                      title: 'Mood Tracking',
                      description: 'Monitor your emotional wellness journey over time',
                    },
                  ].map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-gradient-secondary rounded-xl border border-primary/10"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    </motion.div>
                  ))}
                </div>

                <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 text-center">
                  <p className="text-sm text-foreground font-medium mb-1">
                    You're safe here 🌿
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Everything you share is private and secure. We're here to support you.
                  </p>
                </div>

                <Button
                  onClick={handleContinue}
                  className="w-full bg-primary hover:bg-primary/90 transition-smooth"
                  size="lg"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;
