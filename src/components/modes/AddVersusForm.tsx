import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, X, Swords } from 'lucide-react';
import  Button  from '../ui/button';
import  Input  from '../ui/input';

interface Friend {
  id: string;
  name: string;
  avatar: string | null;
}

interface AddVersusFormProps {
  currentFriend: string;
  setCurrentFriend: (name: string) => void;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentAvatar: File | null;
  addFriend: () => void;
  friends: Friend[];
  removeFriend: (id: string) => void;
  startComparison: () => void;
  maxFriends?: number;
}

const AddVersusForm: React.FC<AddVersusFormProps> = ({
  currentFriend,
  setCurrentFriend,
  handleAvatarChange,
  currentAvatar,
  addFriend,
  friends,
  removeFriend,
  startComparison,
  maxFriends = 2
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Sélectionnez deux amis à comparer</h2>
        <p className="text-gray-600">
          {friends.length === 0
            ? "Commencez par ajouter deux amis"
            : friends.length === 1
            ? "Ajoutez encore un ami"
            : "Vous pouvez maintenant lancer la comparaison"}
        </p>
      </div>

      {friends.length < maxFriends && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Nom de l'ami"
              value={currentFriend}
              onChange={(e) => setCurrentFriend(e.target.value)}
              className="flex-1"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              id="avatar"
            />
            <label
              htmlFor="avatar"
              className="cursor-pointer px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Avatar
            </label>
            <Button
              onClick={addFriend}
              disabled={!currentFriend.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Ajouter
            </Button>
          </div>
          {currentAvatar && (
            <p className="text-sm text-gray-600">
              Image sélectionnée: {currentAvatar.name}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <AnimatePresence>
          {friends.map((friend) => (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative bg-white p-4 rounded-lg shadow-md border border-gray-200"
            >
              <button
                onClick={() => removeFriend(friend.id)}
                className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
              <div className="flex items-center gap-3">
                {friend.avatar ? (
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <h3 className="font-semibold">{friend.name}</h3>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {friends.length === maxFriends && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mt-6"
        >
          <Button
            onClick={startComparison}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg shadow-lg transition-all duration-300"
          >
            <Swords className="w-5 h-5 mr-2" />
            Lancer la comparaison
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default AddVersusForm;
