import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Phone, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useElectron } from '@/hooks/useElectron';

/**
 * SOS Panic Button Component
 * 
 * Features:
 * - Floating button (always visible, non-intrusive)
 * - Confirmation modal to prevent accidental triggers
 * - Sends emergency alert to user's emergency contact via Telegram
 * - Desktop keyboard shortcut: Ctrl/Cmd+Shift+E
 * - Calm design (not alarming despite emergency function)
 */
const SOSButton = ({ className = '' }) => {
  const { user } = useAuth();
  const { isElectron, showNotification } = useElectron();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  // Listen to Electron keyboard shortcut (Ctrl/Cmd+Shift+E)
  React.useEffect(() => {
    const handleElectronSOS = () => {
      setShowConfirmation(true);
    };

    window.addEventListener('electron-trigger-sos', handleElectronSOS);
    return () => window.removeEventListener('electron-trigger-sos', handleElectronSOS);
  }, []);

  const handleSOSClick = () => {
    setShowConfirmation(true);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setAlertSent(false);
  };

  const handleConfirm = async () => {
    if (!user?.emergencyContact?.telegramChatId) {
      toast.error('No emergency contact set. Please add one in Settings.');
      setShowConfirmation(false);
      return;
    }

    setIsSending(true);

    try {
      // TODO: Replace with actual SoulSync Telegram bot API call
      // For now, simulate the API call
      
      const emergencyMessage = {
        userId: user.id,
        userName: user.name,
        chatId: user.emergencyContact.telegramChatId,
        contactName: user.emergencyContact.name,
        timestamp: new Date().toISOString(),
        message: `🚨 EMERGENCY ALERT\n\n${user.name} has triggered an emergency alert from SoulSync.\n\nThey may need immediate support. Please check on them.\n\nTime: ${new Date().toLocaleString()}`
      };

      // Simulate API call (replace with actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, make actual API call:
      // const response = await fetch('https://api.soulsync.com/telegram/emergency-alert', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(emergencyMessage)
      // });
      // if (!response.ok) throw new Error('Failed to send alert');

      console.log('Emergency alert sent:', emergencyMessage);

      // Show success
      setAlertSent(true);
      
      // Desktop notification
      if (isElectron) {
        await showNotification(
          'Emergency Alert Sent',
          `Alert sent to ${user.emergencyContact.name}`,
          { silent: false }
        );
      }

      toast.success(`Emergency alert sent to ${user.emergencyContact.name}`);

      // Auto-close after 3 seconds
      setTimeout(() => {
        setShowConfirmation(false);
        setAlertSent(false);
      }, 3000);

    } catch (error) {
      console.error('Error sending emergency alert:', error);
      toast.error('Failed to send emergency alert. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating SOS Button */}
      <motion.div
        className={`fixed bottom-6 right-6 z-50 ${className}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={handleSOSClick}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 border-2 border-white/20"
          title="Emergency SOS (Ctrl+Shift+E)"
        >
          <AlertTriangle className="w-6 h-6 text-white" />
        </Button>

        {/* Pulse animation ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-amber-400/50 -z-10"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {alertSent ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                    <Check className="w-6 h-6 text-success" />
                  </div>
                  Alert Sent
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-warning" />
                  </div>
                  Emergency Alert
                </>
              )}
            </DialogTitle>
            <DialogDescription className="space-y-3 pt-2">
              {alertSent ? (
                <div className="text-center py-4">
                  <p className="text-base text-foreground">
                    Emergency alert has been sent to:
                  </p>
                  <p className="text-lg font-semibold text-primary mt-2">
                    {user?.emergencyContact?.name}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    via Telegram
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-base">
                    This will send an emergency alert to your emergency contact:
                  </p>
                  {user?.emergencyContact ? (
                    <div className="bg-muted/50 p-3 rounded-lg space-y-1">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold text-foreground">
                          {user.emergencyContact.name}
                        </span>
                      </div>
                      {user.emergencyContact.relationship && (
                        <p className="text-sm text-muted-foreground pl-6">
                          {user.emergencyContact.relationship}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-destructive/10 p-3 rounded-lg text-destructive text-sm">
                      ⚠️ No emergency contact set. Please add one in Settings.
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground pt-2">
                    They will receive a message that you need support.
                  </p>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {!alertSent && (
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isSending || !user?.emergencyContact?.telegramChatId}
                className="bg-warning hover:bg-warning/90"
              >
                {isSending ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Sending...
                  </>
                ) : (
                  <>Send Emergency Alert</>
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SOSButton;
