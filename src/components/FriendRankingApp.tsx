"use client";

import React, { useState, useEffect, ChangeEvent } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import Button from '../components/ui/button';
import AddFriendForm from './AddFriendForm';
import Questionnaire from './Questionnaire';
import FinalRanking from './FinalRanking';
import SignUp from './SignUp';
import SignIn from './SignIn';
import SignOut from './SignOut';
import RankingHistory from './RankingHistory';
import { selectNextFriendToRate, calculateFinalRankings } from './utils';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { v4 as uuidv4 } from 'uuid';
import { Users } from 'lucide-react';
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

const FriendRankingApp = () => {
  const [user, setUser] = useState<any>(null);
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
    if (currentTraitIndex !== null && personalityTraits[currentTraitIndex]) {
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
  }, [currentTraitIndex, friendRatings]);

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
  };

  const restartWithSameFriends = () => {
    setCurrentTraitIndex(null);
    setFriendRatings({});
    setFinalRankings(null);
    setUsedQuestions({});
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

  const renderContent = () => {
    if (!user) {
      return (
        <div className="flex flex-col items-center">
          <SignUp />
          <SignIn />
        </div>
      );
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
          showHistory={showHistory}
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
        <CardHeader className="bg-gradient-to-r from-blue-700 to-purple-700 text-white p-6 rounded-t-lg flex items-center">
          <CardTitle className="text-3xl flex items-center flex-grow">
            <Users className="mr-2" /> Classement de mes Amis
          </CardTitle>
        </CardHeader>
        {user && <SignOut className="absolute top-4 right-4" />}
        <CardContent className="p-8">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default FriendRankingApp;