import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import SignOut from '../SignOut';
import { Users, ArrowLeft, Heart, Star, Lock, Smile, Shield } from 'lucide-react';
import { Grid, Paper, Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';
import personalityTraits from '../../data/personalityTraits';
import { firestoreService } from '../../services/firestore';
import ThemedQuestionnaire from './ThemedQuestionnaire';
import ThemedResult from './ThemedResult';
import AddFriendForm from '../AddFriendForm';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Friend {
  id: string;
  name: string;
  avatar: string | null;
}

const getTraitIcon = (traitId: string) => {
  switch (traitId) {
    case 'emotional-support':
      return <Heart className="w-8 h-8 mb-2 text-pink-500" />;
    case 'fun-adventure':
      return <Star className="w-8 h-8 mb-2 text-yellow-500" />;
    case 'confidentiality':
      return <Lock className="w-8 h-8 mb-2 text-purple-500" />;
    case 'complicity':
      return <Smile className="w-8 h-8 mb-2 text-green-500" />;
    case 'loyalty':
      return <Shield className="w-8 h-8 mb-2 text-blue-500" />;
    default:
      return null;
  }
};

const ThemedMode: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [currentFriend, setCurrentFriend] = useState('');
  const [currentAvatar, setCurrentAvatar] = useState<File | null>(null);
  const [selectedTrait, setSelectedTrait] = useState<string | null>(null);
  const [step, setStep] = useState<'select-theme' | 'add-friends' | 'questionnaire' | 'results'>('select-theme');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestionRatings, setCurrentQuestionRatings] = useState<{ [friendId: string]: number }>({});
  const [ratings, setRatings] = useState<{ [friendId: string]: number }>({});

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
    if (currentFriend.trim() !== '') {
      if (user) {
        try {
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

  const handleThemeSelection = (traitId: string) => {
    setSelectedTrait(traitId);
    setStep('add-friends');
  };

  const startEvaluation = () => {
    if (selectedTrait && friends.length > 0) {
      setStep('questionnaire');
      setCurrentQuestionIndex(0);
    }
  };

  const handleRating = async (friendId: string, rating: number) => {
    try {
      if (user && selectedTrait) {
        await firestoreService.addRating(user.uid, {
          traitId: selectedTrait,
          score: rating,
          friendId,
          mode: 'themed'
        });

        setCurrentQuestionRatings(prev => ({
          ...prev,
          [friendId]: rating
        }));

        // Vérifier si tous les amis ont été notés pour la question actuelle
        const allFriendsRated = friends.every(friend => 
          Object.keys(currentQuestionRatings).includes(friend.id) || friend.id === friendId
        );

        if (allFriendsRated) {
          // Mettre à jour les ratings globaux
          setRatings(prev => ({
            ...prev,
            ...currentQuestionRatings,
            [friendId]: rating
          }));

          // Passer à la question suivante
          if (currentQuestionIndex < personalityTraits.find(t => t.id === selectedTrait)!.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setCurrentQuestionRatings({}); // Réinitialiser les ratings pour la nouvelle question
          } else {
            setStep('results');
          }
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleRestart = () => {
    setFriends([]);
    setSelectedTrait(null);
    setRatings({});
  };

  const removeFriend = (friendId: string) => {
    setFriends(friends.filter(friend => friend.id !== friendId));
  };

  const renderContent = () => {
    if (!user) return null;

    switch (step) {
      case 'select-theme':
        return (
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" className="text-center mb-6">
              Choisissez un thème pour évaluer vos amis
            </Typography>
            <Grid container spacing={3} className='mb-4'>
              {personalityTraits.map((trait) => (
                <Grid item xs={12} sm={6} md={4} key={trait.id}>
                  <Paper
                    elevation={selectedTrait === trait.id ? 4 : 1}
                    onClick={() => handleThemeSelection(trait.id)}
                    sx={{
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      borderRadius: 2,
                      border: selectedTrait === trait.id ? '2px solid' : '1px solid',
                      borderColor: selectedTrait === trait.id ? 'primary.main' : 'grey.200',
                      backgroundColor: selectedTrait === trait.id ? 'rgba(25, 118, 210, 0.08)' : 'background.paper',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      }
                    }}
                  >
                    {getTraitIcon(trait.id)}
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ 
                        color: selectedTrait === trait.id ? 'primary.dark' : 'text.primary',
                        fontWeight: 600
                      }}
                    >
                      {trait.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 2, 
                        textAlign: 'center',
                        color: selectedTrait === trait.id ? 'text.primary' : 'text.secondary'
                      }}
                    >
                      {trait.description}
                    </Typography>
                    <Button
                      variant={selectedTrait === trait.id ? "contained" : "outlined"}
                      color="primary"
                      sx={{
                        mt: 'auto',
                        borderRadius: 2,
                        textTransform: 'none',
                        minWidth: 140
                      }}
                    >
                      {selectedTrait === trait.id ? 'Sélectionné' : 'Choisir'}
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 'add-friends':
        return (
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" className="text-center mb-6">
              Ajoutez les amis que vous souhaitez évaluer pour {personalityTraits.find(t => t.id === selectedTrait)?.name}
            </Typography>
            <AddFriendForm
              currentFriend={currentFriend}
              setCurrentFriend={setCurrentFriend}
              handleAvatarChange={handleAvatarChange}
              currentAvatar={currentAvatar}
              addFriend={addFriend}
              friends={friends}
              removeFriend={removeFriend}
              startQuestionnaire={startEvaluation}
            />
          </Box>
        );

      case 'questionnaire':
        return (
          <ThemedQuestionnaire
            friends={friends}
            trait={selectedTrait!}
            onRate={handleRating}
            ratings={currentQuestionRatings} // Utiliser currentQuestionRatings au lieu de ratings
            currentQuestion={currentQuestionIndex}
            totalQuestions={personalityTraits.find(t => t.id === selectedTrait)!.questions.length}
          />
        );

      case 'results':
        return (
          <ThemedResult
            friends={friends}
            ratings={ratings}
            trait={selectedTrait!}
            onRestart={() => {
              setStep('select-theme');
              handleRestart();
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen min-w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-700 to-purple-700 text-white p-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/app')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6" />
              <CardTitle className="text-3xl">Mode Thématique</CardTitle>
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

export default ThemedMode;
