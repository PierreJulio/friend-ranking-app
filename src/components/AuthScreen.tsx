import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { useRouter } from 'next/router';

const AuthScreen: React.FC = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const router = useRouter();

  const handleAuthSuccess = () => {
    router.push('/app');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <AnimatePresence mode="wait">
        {showSignUp ? (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <SignUp 
              onBackToSignIn={() => setShowSignUp(false)}
              onAuthSuccess={handleAuthSuccess}
            />
          </motion.div>
        ) : (
          <motion.div
            key="signin"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <SignIn 
              onSignUpClick={() => setShowSignUp(true)}
              onAuthSuccess={handleAuthSuccess}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthScreen;
