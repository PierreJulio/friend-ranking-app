import React from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/card';
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
      className="space-y-6 bg-white p-4 rounded-lg shadow-md"
    >
      {progress > 0 && (
        <div className="mb-4">
          <div className="w-full bg-gray-300 h-2.5 rounded-full">
            <motion.div
              className="bg-blue-600 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-sm text-blue-600 mt-2">{progress}% complété</p>
        </div>
      )}

      {/* Question Card */}
      <Card className="p-6 border-2 border-blue-100 shadow-lg">
        <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2 text-blue-500" />
          {trait.name}
        </h3>
        <p className="text-gray-600 text-sm mb-6">{trait.description}</p>
        
        {currentQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <p className="text-lg font-medium text-gray-800">{currentQuestion}</p>
            
            <div className="flex flex-col space-y-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <motion.button
                  key={rating}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleRating(trait.id, currentRandomFriend!, rating);
                    saveRating(trait.id, currentRandomFriend!, rating);
                    const nextFriend = selectNextFriendToRate(trait);
                    if (!nextFriend) {
                      if (currentTraitIndex !== null && currentTraitIndex < personalityTraits.length - 1) {
                        setCurrentTraitIndex(currentTraitIndex !== null ? currentTraitIndex + 1 : 0);
                      } else {
                        calculateFinalRankings();
                      }
                    }
                  }}
                  className={`
                    flex items-center justify-between
                    p-4 rounded-lg transition-all
                    ${rating === 5 ? 'bg-green-100 hover:bg-green-200' : ''}
                    ${rating === 4 ? 'bg-blue-100 hover:bg-blue-200' : ''}
                    ${rating === 3 ? 'bg-yellow-100 hover:bg-yellow-200' : ''}
                    ${rating === 2 ? 'bg-orange-100 hover:bg-orange-200' : ''}
                    ${rating === 1 ? 'bg-red-100 hover:bg-red-200' : ''}
                  `}
                >
                  <span className="text-gray-700">
                    {rating === 5 && "Totalement d'accord"}
                    {rating === 4 && "D'accord"}
                    {rating === 3 && "Neutre"}
                    {rating === 2 && "Pas d'accord"}
                    {rating === 1 && "Pas du tout d'accord"}
                  </span>
                  <div className="flex items-center">
                    {[...Array(rating)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 
                          ${rating === 5 ? 'text-green-500' : ''}
                          ${rating === 4 ? 'text-blue-500' : ''}
                          ${rating === 3 ? 'text-yellow-500' : ''}
                          ${rating === 2 ? 'text-orange-500' : ''}
                          ${rating === 1 ? 'text-red-500' : ''}
                        `}
                      />
                    ))}
                    <ChevronRight className="w-4 h-4 ml-2 text-gray-400" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default Questionnaire;