import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { motion } from 'framer-motion';
import { Lock, Mail, UserPlus } from 'lucide-react';
import { useRouter } from 'next/router';
import Button from '../components/ui/button';
import Input from '../components/ui/input';

interface SignUpProps {
  onBackToSignIn: () => void;
  onAuthSuccess: () => void;
}

// Pour l'usage standalone (sans props)
const SignUp = ({ onBackToSignIn = () => {}, onAuthSuccess = () => {} }: Partial<SignUpProps>) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      setError('');
      onAuthSuccess();
    } catch (error) {
      setError((error as any).message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg"
    >
      <div className="flex items-center justify-center mb-6">
        <UserPlus className="h-8 w-8 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Créer un compte</h2>
      </div>

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
          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre email"
            className="pl-10 w-full p-3 border-2 rounded-lg focus:border-blue-500"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choisir un mot de passe"
            className="pl-10 w-full p-3 border-2 rounded-lg focus:border-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Minimum 6 caractères
          </p>
        </div>

        <Button 
          onClick={handleSignUp}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors duration-200"
        >
          Créer mon compte
        </Button>
      </div>

      <p className="mt-4 text-sm text-center text-gray-600">
        Déjà inscrit ? 
        <button 
          onClick={onBackToSignIn}
          className="text-blue-600 hover:underline ml-1 font-medium"
        >
          Se connecter
        </button>
      </p>
    </motion.div>
  );
};

export default SignUp;