import React from 'react';
import { X } from 'lucide-react';

interface LegalModalProps {
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
}

export function LegalModal({ type, onClose }: LegalModalProps) {
  if (!type) return null;

  const isTerms = type === 'terms';

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl p-6 md:p-8 space-y-6 animate-in zoom-in-95 shadow-2xl border-4 border-primary/20 dark:border-primary/40">
        <div className="flex items-center justify-between sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur pb-4 border-b border-gray-100 dark:border-gray-800 z-10">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            {isTerms ? 'Terms and Conditions' : 'Privacy Policy'}
          </h2>
          <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 text-gray-600 dark:text-gray-300 font-medium leading-relaxed pb-4">
          {isTerms ? (
            <>
              <p>Welcome to Mooderia. By using our application, you agree to these terms and conditions.</p>
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">1. Use of the Application</h3>
              <p>Mooderia is a personal diary and mood tracking application. You are responsible for maintaining the confidentiality of your PIN and the security of your device.</p>
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">2. Data Storage</h3>
              <p>All your data, including diary entries, routines, and vault items, are stored locally on your device. We do not have access to your data. If you delete the app or clear your browser data, your information will be permanently lost unless backed up.</p>
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">3. Contact Us</h3>
              <p>If you have any questions about these Terms, please contact us at:</p>
              <div className="text-center py-4">
                <a href="mailto:mooderiasite@gmail.com" className="inline-block bg-primary/10 text-primary font-black text-lg px-6 py-3 rounded-xl hover:bg-primary/20 transition-colors border-2 border-primary/20">
                  mooderiasite@gmail.com
                </a>
              </div>
            </>
          ) : (
            <>
              <p>Your privacy is our top priority at Mooderia. This policy outlines how we handle your information.</p>
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">1. Information Collection</h3>
              <p>Mooderia is designed to be a completely private, offline-first application. We do not collect, transmit, or store your personal data on any external servers.</p>
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">2. Local Storage</h3>
              <p>Everything you create within Mooderia—your profile, diary entries, mood logs, and vault media—is stored securely and exclusively on your local device using web storage technologies.</p>
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">3. Contact Us</h3>
              <p>If you have any questions or concerns regarding your privacy, please reach out to us at:</p>
              <div className="text-center py-4">
                <a href="mailto:mooderiasite@gmail.com" className="inline-block bg-primary/10 text-primary font-black text-lg px-6 py-3 rounded-xl hover:bg-primary/20 transition-colors border-2 border-primary/20">
                  mooderiasite@gmail.com
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
