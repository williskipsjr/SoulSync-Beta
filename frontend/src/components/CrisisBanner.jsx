import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, X, Phone, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner';

export const CrisisBanner = ({ onClose }) => {
  const handleEmergencyContact = () => {
    toast.success('Emergency alert sent', {
      description: 'Your emergency contact has been notified.',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="p-4 border-b border-destructive/20 bg-destructive/5"
    >
      <Card className="border-2 border-destructive/30 bg-card">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-destructive mb-1">We're here for you</h3>
              <p className="text-sm text-foreground mb-3">
                It seems like you might be going through a difficult time. Please know that you're
                not alone, and help is available.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={handleEmergencyContact}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  <Phone className="w-3 h-3 mr-2" />
                  Contact Emergency Contact
                </Button>
                <Button size="sm" variant="outline" className="border-destructive/30">
                  <MessageCircle className="w-3 h-3 mr-2" />
                  Crisis Resources
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Crisis Helpline: 988 (US) | Text "HELLO" to 741741
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 h-8 w-8"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CrisisBanner;
