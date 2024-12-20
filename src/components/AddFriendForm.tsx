import React, { ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Trash } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Input from '../components/ui/input';
import Button from '../components/ui/button';

interface AddFriendFormProps {
  currentFriend: string;
  setCurrentFriend: (value: string) => void;
  handleAvatarChange: (e: ChangeEvent<HTMLInputElement>) => void;
  currentAvatar: File | null;
  addFriend: () => void;
  friends: { id: string; name: string; avatar: string | null }[];
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
  const saveFriend = async (friend: { id: string; name: string; avatar: string | null }) => {
    await addDoc(collection(db, 'friends'), {
      userId,
      ...friend
    });
  };

  const handleAddFriend = () => {
    addFriend();
    const newFriend = friends[friends.length - 1];
    saveFriend(newFriend);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <UserPlus className="mr-2" /> Ajouter des Amis
      </h2>
      <div className="mb-4">
        <Input
          type="text"
          value={currentFriend}
          onChange={(e) => setCurrentFriend(e.target.value)}
          placeholder="Nom de l'ami"
          className="mb-2"
        />
        <Input type="file" onChange={handleAvatarChange} className="mb-2" />
        {currentAvatar && (
          <div className="mb-2">
            <img
              src={URL.createObjectURL(currentAvatar)}
              alt="Aperçu Avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>
        )}
        <Button onClick={handleAddFriend} className="mt-2 flex items-center justify-center">
          <UserPlus className="mr-2" /> Ajouter
        </Button>
      </div>
      <ul className="mb-4 space-y-2">
        {friends.map((friend) => (
          <li key={friend.id} className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded-lg shadow-sm">
            <div className="flex items-center space-x-4">
              {friend.avatar ? (
                <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                  {friend.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span>{friend.name}</span>
            </div>
            <Button onClick={() => removeFriend(friend.id)} variant="outline" className="flex items-center justify-center">
              <Trash className="mr-2" /> Supprimer
            </Button>
          </li>
        ))}
      </ul>
      {friends.length > 0 && (
        <Button onClick={startQuestionnaire} className="mt-4 flex items-center justify-center">
          Commencer le Questionnaire
        </Button>
      )}
    </motion.div>
  );
};

export default AddFriendForm;