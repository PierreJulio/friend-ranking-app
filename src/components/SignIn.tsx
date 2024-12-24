import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import Button from '../components/ui/button';
import Input from '../components/ui/input';

interface SignInProps {
  onSignUpClick: () => void;
  onAuthSuccess: () => void;
}

// Pour l'usage standalone (sans props)
const SignIn = ({ onSignUpClick = () => {}, onAuthSuccess = () => {} }: Partial<SignInProps>) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      setError('');
      onAuthSuccess();
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Connexion</h2>
      
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm"
        >
          {error}
        </motion.div>
      )}

      <div className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre email"
            className="pl-10 w-full p-3 border-2 rounded-lg focus:border-blue-500"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre mot de passe"
            className="pl-10 w-full p-3 border-2 rounded-lg focus:border-blue-500"
          />
        </div>

        <Button 
          onClick={handleSignIn}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors duration-200"
        >
          Se connecter
        </Button>
      </div>

      <p className="mt-4 text-sm text-center text-gray-600">
        Pas encore de compte ? 
        <button 
        onClick={onSignUpClick} 
        className="text-blue-600 hover:underline ml-1 font-medium"
        >
          S&apos;inscrire
        </button>
      </p>
    </motion.div>
  );
};

export default SignIn;