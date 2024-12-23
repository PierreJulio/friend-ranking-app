import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, where, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';

export interface Friend {
  id: string;
  name: string;
}

export interface Rating {
  traitId: string;
  score: number;
  friendId: string;
  mode: 'standard' | 'versus' | 'themed';
}

class FirestoreService {
  async addFriend(userId: string, friend: Omit<Friend, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, 'friends'), {
        userId,
        name: friend.name,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding friend:', error);
      throw error;
    }
  }

  async getFriendByName(userId: string, friendName: string) {
    try {
      const friendsRef = collection(db, 'friends');
      const q = query(friendsRef, where('userId', '==', userId), where('name', '==', friendName));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data() as Friend;
        return { id: doc.id, name: data.name };
      }
      return null;
    } catch (error) {
      console.error('Error getting friend by name:', error);
      throw error;
    }
  }

  async getFriendsWithRatings(userId: string) {
    try {
      const friendsRef = collection(db, 'friends');
      const friendsQuery = query(friendsRef, where('userId', '==', userId));
      const friendsSnapshot = await getDocs(friendsQuery);
      const friends = new Map();

      friendsSnapshot.docs.forEach(doc => {
        friends.set(doc.id, {
          id: doc.id,
          ...doc.data()
        });
      });

      const ratingsRef = collection(db, 'ratings');
      const ratingsQuery = query(ratingsRef, where('userId', '==', userId));
      const ratingsSnapshot = await getDocs(ratingsQuery);

      const friendsWithRatings = Array.from(friends.values()).map(friend => ({
        ...friend,
        ratings: ratingsSnapshot.docs
          .filter(doc => doc.data().friendId === friend.id && doc.data().mode)
          .map(doc => ({
            traitId: doc.data().traitId,
            score: doc.data().score,
            mode: doc.data().mode
          }))
      }));

      return friendsWithRatings;
    } catch (error) {
      console.error('Error getting friends with ratings:', error);
      throw error;
    }
  }

  async addRating(userId: string, rating: Rating) {
    try {
      await addDoc(collection(db, 'ratings'), {
        userId,
        ...rating,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding rating:', error);
      throw error;
    }
  }

  async addEvaluationSession(userId: string, mode: string, friendIds: string[]) {
    try {
      return await addDoc(collection(db, 'evaluationSessions'), {
        userId,
        mode,
        friendIds,
        startedAt: serverTimestamp(),
        ratings: {}
      });
    } catch (error) {
      console.error('Error creating evaluation session:', error);
      throw error;
    }
  }

  async deleteFriend(userId: string, friendId: string) {
    try {
      // Supprimer l'ami
      await deleteDoc(doc(db, 'friends', friendId));

      // Supprimer tous les ratings associés à cet ami
      const ratingsRef = collection(db, 'ratings');
      const ratingsQuery = query(
        ratingsRef,
        where('userId', '==', userId),
        where('friendId', '==', friendId)
      );
      const ratingsSnapshot = await getDocs(ratingsQuery);
      
      const deletionPromises = ratingsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletionPromises);
    } catch (error) {
      console.error('Error deleting friend:', error);
      throw error;
    }
  }

  async resetFriendRatings(userId: string, friendId: string) {
    try {
      const ratingsRef = collection(db, 'ratings');
      const ratingsQuery = query(
        ratingsRef,
        where('userId', '==', userId),
        where('friendId', '==', friendId)
      );
      const ratingsSnapshot = await getDocs(ratingsQuery);
      
      const deletionPromises = ratingsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletionPromises);
    } catch (error) {
      console.error('Error resetting friend ratings:', error);
      throw error;
    }
  }

  async resetAllFriendsRatings(userId: string) {
    try {
      const ratingsRef = collection(db, 'ratings');
      const ratingsQuery = query(ratingsRef, where('userId', '==', userId));
      const ratingsSnapshot = await getDocs(ratingsQuery);
      
      const deletionPromises = ratingsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletionPromises);
    } catch (error) {
      console.error('Error resetting all friends ratings:', error);
      throw error;
    }
  }
}

export const firestoreService = new FirestoreService();
