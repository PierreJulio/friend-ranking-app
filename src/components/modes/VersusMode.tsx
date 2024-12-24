import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import AddVersusForm from './AddVersusForm'; // Nous allons créer ce composant
import SignOut from '../SignOut';
import { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Swords, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import personalityTraits from '../../data/personalityTraits';
import VersusQuestionnaire from './VersusQuestionnaire';
import VersusResult from './VersusResult';
import { firestoreService } from '../../services/firestore';

Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface Friend {
  id: string;
  name: string;
  avatar: string | null;
}

const VersusMode: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [currentFriend, setCurrentFriend] = useState('');
  const [currentAvatar, setCurrentAvatar] = useState<File | null>(null);
  const [friendRatings, setFriendRatings] = useState<{ [key: string]: { [key: string]: number } }>({});
  const [currentTraitIndex, setCurrentTraitIndex] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) router.push('/');
    });
    return () => unsubscribe();
  }, [router]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCurrentAvatar(e.target.files[0]);
    }
  };

  const addFriend = async () => {
    if (currentFriend.trim() !== '' && friends.length < 2) {
      const isDuplicate = friends.some(friend => 
        friend.name.toLowerCase() === currentFriend.trim().toLowerCase()
      );

      if (isDuplicate) {
        alert(`L'ami "${currentFriend.trim()}" existe déjà dans la liste.`);
        return;
      }

      if (user) {
        try {
          const existingFriend = await firestoreService.getFriendByName(user.uid, currentFriend.trim());
          if (existingFriend !== null) {
            const newFriend: Friend = {
              id: existingFriend.id,
              name: existingFriend.name as string,
              avatar: currentAvatar ? URL.createObjectURL(currentAvatar) : null
            };

            setFriends([...friends, newFriend]);
            setCurrentFriend('');
            setCurrentAvatar(null);
            return;
          }

          const newFriendId = await firestoreService.addFriend(user.uid, {
            name: currentFriend.trim(),
          });

          const newFriend: Friend = {
            id: newFriendId,
            name: currentFriend.trim(),
            avatar: currentAvatar ? URL.createObjectURL(currentAvatar) : null
          };

          setFriends([...friends, newFriend]);
          setCurrentFriend('');
          setCurrentAvatar(null);
        } catch (error) {
          console.error('Erreur lors de l\'ajout de l\'ami:', error);
        }
      }
    }
  };

  const removeFriend = (friendId: string) => {
    setFriends(friends.filter(friend => friend.id !== friendId));
    setShowComparison(false);
  };

  const startComparison = () => {
    if (friends.length === 2) {
      setCurrentTraitIndex(0);
      setFriendRatings({});
      setShowComparison(true);
    }
  };

  const handleRating = async (trait: string, friendId: string, rating: number) => {
    try {
      if (user) {
        await firestoreService.addRating(user.uid, {
          traitId: trait,
          score: rating,
          friendId,
          mode: 'versus'
        });
      }

      setFriendRatings(prev => {
        const updatedRatings = { ...prev };
        if (!updatedRatings[trait]) {
          updatedRatings[trait] = {};
        }
        updatedRatings[trait][friendId] = rating;

        const ratingsForTrait = updatedRatings[trait];
        if (Object.keys(ratingsForTrait).length === 2) {
          // Utiliser requestAnimationFrame pour une transition plus fluide
          requestAnimationFrame(() => {
            if (currentTraitIndex !== null && currentTraitIndex < personalityTraits.length - 1) {
              setCurrentTraitIndex(currentTraitIndex + 1);
            } else {
              setShowResults(true);
            }
          });
        }

        return updatedRatings;
      });

    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleShowResults = () => {
    setShowResults(true);
  };

  const handleNewComparison = () => {
    setCurrentTraitIndex(0);
    setFriendRatings({});
    setShowResults(false);
  };

  const handleRestart = () => {
    setFriends([]);
    setShowComparison(false);
    setShowResults(false);
    setFriendRatings({});
    setCurrentTraitIndex(null);
  };

  const renderContent = () => {
    if (!user) return null;

    if (showResults) {
      return (
        <VersusResult
          friends={friends}
          ratings={friendRatings}
          onRestart={handleRestart}
          onNewComparison={handleNewComparison}
        />
      );
    }

    if (!showComparison) {
      return (
        <AddVersusForm
          currentFriend={currentFriend}
          setCurrentFriend={setCurrentFriend}
          handleAvatarChange={handleAvatarChange}
          currentAvatar={currentAvatar}
          addFriend={addFriend}
          friends={friends}
          removeFriend={removeFriend}
          startComparison={startComparison}
          maxFriends={2}
        />
      );
    }

    if (currentTraitIndex !== null && personalityTraits[currentTraitIndex]) {
      return (
        <VersusQuestionnaire
          friends={friends}
          trait={personalityTraits[currentTraitIndex]} // Changez 'currentTrait' en 'trait'
          onRate={handleRating}
          currentTraitIndex={currentTraitIndex}
          totalTraits={personalityTraits.length}
        />
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen min-w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-700 to-purple-700 text-white p-6 rounded-t-lg">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/app')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-2">
              <Swords className="w-6 h-6" />
              <CardTitle className="text-3xl">Mode Versus</CardTitle>
            </div>
          </div>
          {user && <SignOut className="ml-auto" />}
        </CardHeader>
        <CardContent className="p-8">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default VersusMode;
