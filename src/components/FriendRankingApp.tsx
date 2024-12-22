"use client";

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import AddFriendForm from './AddFriendForm';
import Questionnaire from './Questionnaire';
import FinalRanking from './FinalRanking';
import SignOut from './SignOut';
import RankingHistory from './RankingHistory';
import { selectNextFriendToRate, calculateFinalRankings } from './utils';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { v4 as uuidv4 } from 'uuid';
import { Users, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import personalityTraits from '../data/personalityTraits';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface Friend {
  id: string;
  name: string;
  avatar: string | null;
}

interface FriendRatings {
  [traitId: string]: {
    [friendId: string]: number;
  };
}

interface Ranking {
  rank: number;
  friend: string;
  avatar: string | null;
  averageScore: string;
  traits: { [traitId: string]: number };
  badges: string[];
}

const saveProgress = (
  _userId: string,
  _friends: Friend[],
  _usedQuestions: string[]
) => {
  void _userId;
  void _friends;
  void _usedQuestions;
  // ...existing code...
};

const FriendRankingApp = () => {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [currentFriend, setCurrentFriend] = useState('');
  const [currentAvatar, setCurrentAvatar] = useState<File | null>(null);
  const [currentTraitIndex, setCurrentTraitIndex] = useState<number | null>(null);
  const [friendRatings, setFriendRatings] = useState<FriendRatings>({});
  const [finalRankings, setFinalRankings] = useState<Ranking[] | null>(null);
  const [currentRandomFriend, setCurrentRandomFriend] = useState<string | null>(null);
  const [usedQuestions, setUsedQuestions] = useState<{ [traitId: string]: Set<number> }>({});
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const totalQuestions = friends.length * personalityTraits.length;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (
      currentTraitIndex !== null &&
      personalityTraits[currentTraitIndex] &&
      user
    ) {
      const nextFriend = selectNextFriendToRate(
        friends,
        friendRatings,
        usedQuestions,
        setUsedQuestions,
        setCurrentQuestion,
        setCurrentRandomFriend,
        personalityTraits[currentTraitIndex]
      );
      if (!nextFriend) {
        if (currentTraitIndex < personalityTraits.length - 1) {
          setCurrentTraitIndex(prev => (prev !== null ? prev + 1 : 0));
        } else {
          calculateFinalRankings(
            friends,
            friendRatings,
            setFinalRankings,
            setCurrentTraitIndex,
            user.uid
          );
        }
      }
    }
  }, [currentTraitIndex, friendRatings, user]);

  useEffect(() => {
    if (user && user.uid && friends.length > 0) {
      saveProgress(user.uid, friends, Object.keys(usedQuestions));
    }
  }, [user, friends, usedQuestions, currentQuestion]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCurrentAvatar(e.target.files[0]);
    }
  };

  const addFriend = () => {
    if (currentFriend.trim() !== '') {
      const isDuplicate = friends.some(friend => friend.name.toLowerCase() === currentFriend.trim().toLowerCase());
      if (isDuplicate) {
        alert(`L'ami "${currentFriend.trim()}" existe déjà.`);
        return;
      }

      const newFriend: Friend = {
        id: uuidv4(),
        name: currentFriend.trim(),
        avatar: currentAvatar ? URL.createObjectURL(currentAvatar) : null
      };

      setFriends([...friends, newFriend]);
      setCurrentFriend('');
      setCurrentAvatar(null);
    }
  };

  const removeFriend = (friendId: string) => {
    setFriends(friends.filter(friend => friend.id !== friendId));
  };

  const startQuestionnaire = () => {
    setCurrentTraitIndex(0);
    setFriendRatings({});
    setFinalRankings(null);
    setUsedQuestions({});
    setQuestionsAnswered(0); // Ajout de cette ligne
  };

  const restartWithSameFriends = () => {
    setCurrentTraitIndex(null);
    setFriendRatings({});
    setFinalRankings(null);
    setUsedQuestions({});
    setQuestionsAnswered(0); // Ajout de cette ligne
  };

  const handleRating = (traitId: string, friendId: string, rating: number) => {
    setFriendRatings(prev => ({
      ...prev,
      [traitId]: {
        ...prev[traitId],
        [friendId]: rating
      }
    }));
    setQuestionsAnswered(prev => prev + 1);
  };

  const handleBackToMenu = () => {
    router.push('/app');
  };

  const renderContent = () => {
    if (!user) {
      return null; // Au lieu d'utiliser Navigate, on utilise l'effet ci-dessus
    }

    if (showHistory) {
      return (
        <RankingHistory 
          userId={user.uid} 
          onClose={() => setShowHistory(false)} 
        />
      );
    }

    if (finalRankings) {
      return (
        <FinalRanking
          finalRankings={finalRankings}
          onRestart={() => {
            setFinalRankings(null);
            setFriends([]);
          }}
          onRestartWithSameFriends={restartWithSameFriends}
          setShowHistory={setShowHistory}
        />
      );
    } else if (currentTraitIndex !== null && personalityTraits[currentTraitIndex]) {
      const trait = personalityTraits[currentTraitIndex];
      const progress = (questionsAnswered / totalQuestions) * 100;

      return (
        <Questionnaire
          trait={trait}
          progress={progress}
          currentQuestion={currentQuestion}
          currentRandomFriend={currentRandomFriend}
          currentTraitIndex={currentTraitIndex}
          handleRating={handleRating}
          selectNextFriendToRate={(trait) => selectNextFriendToRate(
            friends,
            friendRatings,
            usedQuestions,
            setUsedQuestions,
            setCurrentQuestion,
            setCurrentRandomFriend,
            trait
          )}
          calculateFinalRankings={() => calculateFinalRankings(
            friends,
            friendRatings,
            setFinalRankings,
            setCurrentTraitIndex,
            user.uid
          )}
          setCurrentTraitIndex={setCurrentTraitIndex}
          userId={user.uid}
        />
      );
    } else {
      return (
        <AddFriendForm
          currentFriend={currentFriend}
          setCurrentFriend={setCurrentFriend}
          handleAvatarChange={handleAvatarChange}
          currentAvatar={currentAvatar}
          addFriend={addFriend}
          friends={friends}
          removeFriend={removeFriend}
          startQuestionnaire={startQuestionnaire}
          userId={user.uid}
        />
      );
    }
  };

  return (
    <div className="min-h-screen min-w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-700 to-purple-700 text-white p-6 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToMenu}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Retour au menu"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center">
              <Users className="mr-2" />
              <CardTitle className="text-3xl">
                Classement de mes Amis
              </CardTitle>
            </div>
          </div>
          {user && <SignOut className="ml-auto" />} {/* Utilisation de ml-auto pour aligner à droite */}
        </CardHeader>
        <CardContent className="p-8">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default FriendRankingApp;