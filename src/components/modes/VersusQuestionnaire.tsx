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
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const progress = ((currentTraitIndex + 1) / totalTraits) * 100;

  useEffect(() => {
    const traitQuestions = currentTrait.questions;
    const randomIndex = Math.floor(Math.random() * traitQuestions.length);
    const baseQuestion = traitQuestions[randomIndex];
    // Remplacer {friend} par un espace souligné pour créer une question générique
    const genericQuestion = baseQuestion.replace(/{friend}/g, '_____');
    setCurrentQuestion(genericQuestion);
  }, [currentTrait]);

  const handleSelection = (selectedFriendId: string) => {
    const winner = selectedFriendId;
    const loser = friends.find(f => f.id !== selectedFriendId)?.id;

    if (winner && loser) {
      onRate(currentTrait.id, winner, 5);
      onRate(currentTrait.id, loser, 2);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {currentTrait.name}
        </h2>
        
        {/* Nouvelle présentation de la question */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <p className="text-lg text-gray-600 mb-4">
            {currentQuestion.split('_____')[0]}
            <span className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
              {friends[0].name} ou {friends[1].name}
            </span>
            {currentQuestion.split('_____')[1]}
          </p>
        </div>

        <div className="w-full mt-6">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-600 mt-2">
            Trait {currentTraitIndex + 1} sur {totalTraits}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {friends.map((friend) => (
          <motion.div
            key={friend.id}
            whileHover={{ scale: 1.02 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative w-32 h-32">
              {friend.avatar ? (
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-full h-full rounded-full object-cover shadow-lg"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                  <span className="text-4xl font-bold text-white">
                    {friend.name[0]}
                  </span>
                </div>
              )}
            </div>
            <Button
              onClick={() => handleSelection(friend.id)}
              className="w-full px-6 py-8 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 
                         hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-lg 
                         transition-all duration-300 hover:shadow-xl"
            >
              {friend.name}
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-600 italic">
          Sélectionnez la personne qui correspond le mieux à cette question
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {currentTrait.description}
        </p>
      </div>
    </div>
  );
};

export default VersusQuestionnaire;
