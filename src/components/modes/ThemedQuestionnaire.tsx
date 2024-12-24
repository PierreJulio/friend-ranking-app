import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Typography, Rating, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import personalityTraits from '../../data/personalityTraits';

interface Friend {
  id: string;
  name: string;
  avatar: string | null;
}

interface ThemedQuestionnaireProps {
  friends: Friend[];
  trait: {
    id: string;
    name: string;
    description: string;
    questions: {
      friendRankingMode: string[];
      versusMode: string[];
      themedMode: string[];
    };
  };
  onRate: (friendId: string, rating: number) => void;
  ratings: { [key: string]: number };
  currentQuestion: number;
  totalQuestions: number;
}

const ThemedQuestionnaire: React.FC<ThemedQuestionnaireProps> = ({
  friends,
  trait,
  onRate,
  ratings,
  currentQuestion,
  totalQuestions
}) => {
  const currentTrait = personalityTraits.find(t => t.id === trait.id);
  const questionTemplate = currentTrait?.questions.themedMode[currentQuestion];
  const allFriendsRated = friends.every(friend => Object.keys(ratings).includes(friend.id));
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Progress Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md p-4 rounded-lg shadow-sm z-10">
        <div className="text-center space-y-3">
          <Typography variant="h5" className="font-bold text-gray-800">
            {currentTrait?.name}
          </Typography>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <Typography variant="body2" className="text-gray-600">
            Question {currentQuestion + 1} sur {totalQuestions}
          </Typography>
        </div>
      </div>

      {/* Current Question */}
      <div className="bg-blue-50 p-4 rounded-lg my-6">
        <Typography variant="h6" className="text-blue-800 text-center">
          {questionTemplate?.replace('{friend}', '_____')}
        </Typography>
      </div>

      {/* Friends Rating Cards */}
      <div className="grid gap-4">
        {friends.map((friend) => (
          <motion.div
            key={friend.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <Avatar
                      src={friend.avatar || undefined}
                      alt={friend.name}
                      className="w-12 h-12 ring-2 ring-offset-2 ring-blue-500"
                    >
                      {friend.name[0]}
                    </Avatar>
                    <div>
                      <Typography variant="h6" className="font-semibold">
                        {friend.name}
                      </Typography>
                      {!ratings[friend.id] && (
                        <Typography variant="caption" className="text-red-500">
                          En attente de notation
                        </Typography>
                      )}
                    </div>
                  </div>
                  
                  <div className="w-full sm:w-auto flex flex-col items-center sm:items-end gap-2">
                    <Rating
                      value={ratings[friend.id] || 0}
                      onChange={(_, newValue) => onRate(friend.id, newValue || 0)}
                      max={5} // Change max value to 5
                      size="large"
                      className="transform scale-90 sm:scale-100"
                    />
                    {ratings[friend.id] && (
                      <Typography variant="body2" className="text-blue-600 font-medium">
                        Note: {ratings[friend.id]}/5 {/* Change text to "Note: {ratings[friend.id]}/5" */}
                      </Typography>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Notification de progression */}
      {allFriendsRated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg"
        >
          <Typography className="text-center font-medium">
            ✨ Super ! Passage à la prochaine question...
          </Typography>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ThemedQuestionnaire;
