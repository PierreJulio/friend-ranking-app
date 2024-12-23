import { useState, useEffect } from 'react';
import { auth } from '../../firebaseConfig';
import { firestoreService } from '../../services/firestore';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Users, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';

export default function FriendsManagement() {
  const [friends, setFriends] = useState<any[]>([]);
  const [newFriendName, setNewFriendName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      router.push('/');
      return;
    }
    loadFriends(user.uid);
  }, [router]);

  const loadFriends = async (userId: string) => {
    const friendsData = await firestoreService.getFriendsWithRatings(userId);
    setFriends(friendsData);
  };

  const handleAddFriend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    if (newFriendName.trim()) {
      await firestoreService.addFriend(user.uid, { name: newFriendName });
      setNewFriendName('');
      loadFriends(user.uid);
    }
  };

  const handleDeleteFriend = async (friendId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet ami ?')) {
      await firestoreService.deleteFriend(user.uid, friendId);
      loadFriends(user.uid);
    }
  };

  const handleResetRatings = async (friendId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser les scores ?')) {
      await firestoreService.resetFriendRatings(user.uid, friendId);
      loadFriends(user.uid);
    }
  };

  return (
    <div className="min-h-screen min-w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-700 to-purple-700 text-white p-6 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/app')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Retour au menu"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center">
              <Users className="mr-2" />
              <CardTitle className="text-3xl">
                Gestion des Amis
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleAddFriend} className="mb-8 mt-8 flex gap-4">
            <input
              type="text"
              value={newFriendName}
              onChange={(e) => setNewFriendName(e.target.value)}
              placeholder="Nom du nouvel ami"
              className="flex-1 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button 
              type="submit" 
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:opacity-90 transition-opacity"
            >
              Ajouter
            </button>
          </form>

          <div className="grid gap-4">
            {friends.map((friend) => (
              <div 
                key={friend.id} 
                className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">{friend.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {friend.ratings?.length || 0} évaluations
                    </span>
                    {friend.ratings?.length > 0 && (
                      <span className="text-sm text-gray-500">
                        Moyenne: {(friend.ratings.reduce((acc: number, r: { score: number }) => acc + r.score, 0) / friend.ratings.length).toFixed(1)}/5
                      </span>
                    )}
                  </div>
                </div>

                {friend.ratings?.length > 0 && (
                  <div className="mb-4">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        style={{ 
                          width: `${(friend.ratings.reduce((acc: number, r: { score: number }) => acc + r.score, 0) / (friend.ratings.length * 5)) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => handleResetRatings(friend.id)}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Réinitialiser les scores
                  </button>
                  <button
                    onClick={() => handleDeleteFriend(friend.id)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
