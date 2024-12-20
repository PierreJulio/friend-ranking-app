import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Button from '../components/ui/button';
import personalityTraits from '../data/personalityTraits';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface QuestionnaireProps {
  trait: { id: string; name: string; description: string; questions: string[] };
  progress: number;
  currentQuestion: string | null;
  currentRandomFriend: string | null;
  handleRating: (traitId: string, friendId: string, rating: number) => void;
  selectNextFriendToRate: (trait: { id: string; name: string; description: string; questions: string[] }) => string | null;
  calculateFinalRankings: () => void;
  currentTraitIndex: number | null;
  setCurrentTraitIndex: (index: number | null) => void;
  userId: string;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({
  trait,
  progress,
  currentQuestion,
  currentRandomFriend,
  handleRating,
  selectNextFriendToRate,
  currentTraitIndex,
  setCurrentTraitIndex,
  calculateFinalRankings,
  userId
}) => {
  const saveRating = async (traitId: string, friendId: string, rating: number) => {
    await addDoc(collection(db, 'ratings'), {
      userId,
      traitId,
      friendId,
      rating
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold my-4 flex items-center">
        <Star className="mr-2" /> {trait.name}
      </h2>
      <p className="mb-4">{trait.description}</p>
      <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
        <motion.div
          className="bg-blue-600 h-4 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      {currentRandomFriend && currentQuestion && (
        <div>
          <p className="mb-4">{currentQuestion}</p>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                onClick={() => {
                  handleRating(trait.id, currentRandomFriend, rating);
                  saveRating(trait.id, currentRandomFriend, rating);
                  const nextFriend = selectNextFriendToRate(trait);
                  if (!nextFriend) {
                    if (currentTraitIndex !== null && currentTraitIndex < personalityTraits.length - 1) {
                      setCurrentTraitIndex(currentTraitIndex !== null ? currentTraitIndex + 1 : 0);
                    } else {
                      calculateFinalRankings();
                    }
                  }
                }}
                className="flex items-center justify-center"
              >
                {rating} <Star className="w-4 h-4 ml-1" />
              </Button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Questionnaire;