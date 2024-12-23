import React, { ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Trash, Upload } from 'lucide-react';
import Input from '../components/ui/input';
import Button from '../components/ui/button';

interface Friend {
  id: string;
  name: string;
  avatar: string | null;
}

interface AddFriendFormProps {
  currentFriend: string;
  setCurrentFriend: (value: string) => void;
  handleAvatarChange: (e: ChangeEvent<HTMLInputElement>) => void;
  currentAvatar: File | null;
  addFriend: () => void;
  friends: Friend[];
  removeFriend: (friendId: string) => void;
  startQuestionnaire: () => void;
  userId: string;
}

const AddFriendForm: React.FC<AddFriendFormProps> = ({
  currentFriend,
  setCurrentFriend,
  handleAvatarChange,
  currentAvatar,
  addFriend,
  friends,
  removeFriend,
  startQuestionnaire,
  userId
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-6 bg-white rounded-xl shadow-lg mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
        <UserPlus className="mr-3 text-blue-500" /> 
        <span>Ajouter des Amis</span>
      </h2>
      
      <div className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            value={currentFriend}
            onChange={(e) => setCurrentFriend(e.target.value)}
            placeholder="Nom de l'ami"
            className="w-full pl-4 pr-4 py-2 rounded-lg border-2 focus:border-blue-500"
          />
          {currentFriend && (
            <small className="text-gray-500 mt-1">
              Appuyez sur &quot;Ajouter&quot; ou Entrée pour valider
            </small>
          )}
        </div>

        <div className="relative">
          <label className="flex flex-col items-center p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Choisir un avatar</span>
            <Input 
              type="file" 
              onChange={handleAvatarChange} 
              className="hidden"
              accept="image/*"
            />
          </label>
          
          <AnimatePresence>
            {currentAvatar && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-3 flex justify-center"
              >
                <img
                  src={URL.createObjectURL(currentAvatar)}
                  alt="Aperçu Avatar"
                  className="w-24 h-24 rounded-full object-cover ring-2 ring-blue-500"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button 
          onClick={addFriend}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors py-2 rounded-lg flex items-center justify-center"
        >
          <UserPlus className="mr-2" /> Ajouter
        </Button>
      </div>

      <AnimatePresence>
        {friends.length > 0 && (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 space-y-3"
          >
            {friends.map((friend) => (
              <motion.li
                key={friend.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {friend.avatar ? (
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                      {friend.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium">{friend.name}</span>
                </div>
                <Button
                  onClick={() => removeFriend(friend.id)}
                  variant="outline"
                  className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                >
                  <Trash className="h-5 w-5" />
                </Button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {friends.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6"
        >
          <Button 
            onClick={startQuestionnaire}
            className="w-full bg-green-500 hover:bg-green-600 text-white transition-colors py-3 rounded-lg text-lg font-semibold"
          >
            Commencer le Questionnaire
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AddFriendForm;