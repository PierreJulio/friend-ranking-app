import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Progress } from '../ui/progress';
import Button from '../ui/button';
import personalityTraits from '../../data/personalityTraits';

interface Friend {
  id: string;
  name: string;
  avatar: string | null;
}

interface VersusQuestionnaireProps {
  friends: Friend[];
  currentTrait: {
    id: string;
    name: string;
    description: string;
    questions: string[];
  };
  onRate: (traitId: string, friendId: string, rating: number) => void;
  currentTraitIndex: number;
  totalTraits: number;
}

const VersusQuestionnaire: React.FC<VersusQuestionnaireProps> = ({
  friends,
  currentTrait,
  onRate,
  currentTraitIndex,
  totalTraits,
}) => {
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [currentQuestions, setCurrentQuestions] = useState<string[]>([]);
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const questionsPerTrait = 3;
  
  // Calcul du progrès global
  const totalQuestions = totalTraits * questionsPerTrait;
  const currentQuestionNumber = (currentTraitIndex * questionsPerTrait) + questionIndex + 1;
  const progress = (currentQuestionNumber / totalQuestions) * 100;

  useEffect(() => {
    // Sélectionner 3 questions aléatoires uniques
    const shuffledQuestions = [...currentTrait.questions].sort(() => Math.random() - 0.5);
    setCurrentQuestions(shuffledQuestions.slice(0, questionsPerTrait));
    setQuestionIndex(0);
    setScores({});
    setSelectedWinner(null);
  }, [currentTrait]);

  const handleSelection = (selectedFriendId: string) => {
    if (selectedWinner) return; // Empêcher la sélection multiple

    setSelectedWinner(selectedFriendId);
    const otherFriendId = friends.find(f => f.id !== selectedFriendId)?.id;

    if (otherFriendId) {
      const newScores = {
        ...scores,
        [selectedFriendId]: (scores[selectedFriendId] || 0) + 1
      };
      setScores(newScores);

      // Attendre un moment pour montrer la sélection
      setTimeout(() => {
        if (questionIndex < questionsPerTrait - 1) {
          setQuestionIndex(prev => prev + 1);
          setSelectedWinner(null);
        } else {
          // Fin des questions pour ce trait
          const winningFriend = Object.entries(newScores).reduce((a, b) => 
            b[1] > (a[1] || 0) ? b : a
          )[0];
          
          // Mettre à jour les scores finals
          onRate(currentTrait.id, winningFriend, newScores[winningFriend] || 0);
          onRate(currentTrait.id, otherFriendId, 
            (newScores[otherFriendId] || 0));
        }
      }, 500);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
          {currentTrait.name}
        </h2>
        
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
          <p className="text-xl text-gray-700 font-medium">
            {currentQuestions[questionIndex]?.replace('{friend}', '___')}
          </p>
          <div className="mt-4 flex justify-center items-center gap-2">
            <div className="h-2 w-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600" />
            <p className="text-sm font-medium text-gray-500">
              Question {questionIndex + 1}/{questionsPerTrait}
            </p>
            <div className="h-2 w-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600" />
          </div>
        </div>

        <div className="w-full mt-6">
          <div className="mb-2 flex justify-between text-sm text-gray-600">
            <span>Question {currentQuestionNumber} sur {totalQuestions}</span>
            <span>Trait {currentTraitIndex + 1}/{totalTraits}</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {friends.map((friend) => (
          <motion.div
            key={friend.id}
            whileHover={!selectedWinner ? { scale: 1.02 } : {}}
            className={`relative ${
              selectedWinner === friend.id ? 'ring-4 ring-green-500' : ''
            }`}
          >
            <Button
              onClick={() => handleSelection(friend.id)}
              disabled={!!selectedWinner}
              className={`w-full h-full px-8 py-6 rounded-xl transition-all duration-300
                ${selectedWinner 
                  ? selectedWinner === friend.id
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : 'bg-gray-200 opacity-50'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                }
              `}
            >
              <div className="flex items-center gap-4">
                {friend.avatar ? (
                  <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {friend.name[0]}
                    </span>
                  </div>
                )}
                <span className="text-xl font-semibold text-white">{friend.name}</span>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-600 italic">
          Choisissez la personne qui correspond le mieux à cette situation
        </p>
      </div>
    </div>
  );
};

export default VersusQuestionnaire;
