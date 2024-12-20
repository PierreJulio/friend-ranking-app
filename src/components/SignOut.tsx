import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import Button from '../components/ui/button';
import { LogOut } from 'lucide-react';

interface SignOutProps {
  className?: string;
}

const SignOut: React.FC<SignOutProps> = ({ className }) => {
  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <Button onClick={handleSignOut} className={`flex items-center justify-center bg-red-500 text-white hover:bg-red-700 ${className}`}>
      <LogOut className="w-5 h-5 text-white" />
    </Button>
  );
};

export default SignOut;