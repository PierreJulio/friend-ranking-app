import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import personalityTraits from '../data/personalityTraits';

type Ranking = {
  rank: number;
  friend: string;
  avatar: string | null;
  averageScore: string;
  traits: { [traitId: string]: number };
  badges: string[];
};

type Friend = {
  id: string;
  name: string;
  avatar: string | null;
};

type FriendRatings = {
  [traitId: string]: {
    [friendId: string]: number;
  };
};

type SetFunction<T> = React.Dispatch<React.SetStateAction<T>>;

export const selectNextFriendToRate = (
  friends: Friend[],
  friendRatings: FriendRatings,
  usedQuestions: { [key: string]: Set<number> },
  setUsedQuestions: SetFunction<{ [key: string]: Set<number> }>,
  setCurrentQuestion: React.Dispatch<React.SetStateAction<string | null>>, // Updated type here
  setCurrentRandomFriend: SetFunction<string | null>,
  currentTrait: {
    id: string;
    questions: {
      friendRankingMode: string[];
      versusMode: string[];
      themedMode: string[];
    };
  }
) => {
  const friendsToRate = friends.filter(friend => !(friendRatings[currentTrait.id]?.[friend.id]));
  if (friendsToRate.length === 0) return null;

  const nextFriend = friendsToRate[Math.floor(Math.random() * friendsToRate.length)];

  let usedQuestionsForTrait = usedQuestions[currentTrait.id] || new Set<number>();
  const traitQuestions = currentTrait.questions.friendRankingMode;
  let availableQuestions = traitQuestions
    .map((_, index) => index)
    .filter(index => !usedQuestionsForTrait.has(index));

  if (availableQuestions.length === 0) {
    usedQuestionsForTrait = new Set<number>();
    availableQuestions = traitQuestions.map((_, index) => index);
  }

  const questionIndex = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  const questionTemplate = traitQuestions[questionIndex];
  const question = questionTemplate.replace('{friend}', nextFriend.name); // Utiliser le nom au lieu de l'ID

  setUsedQuestions((prev: { [traitId: string]: Set<number> }) => ({
    ...prev,
    [currentTrait.id]: new Set([...(prev[currentTrait.id] || []), questionIndex])
  }));
  
  setCurrentQuestion(question);
  setCurrentRandomFriend(nextFriend.id);

  return nextFriend.id;
};

export async function calculateFinalRankings(
  friends: Friend[],
  friendRatings: FriendRatings,
  setFinalRankings: SetFunction<Ranking[] | null>,
  setCurrentTraitIndex: SetFunction<number | null>,
  userId: string
) {
  const finalScores: {
    [key: string]: {
      averageScore: number;
      traits: { [traitId: string]: number };
    };
  } = {};

  const bestScoresPerTrait: { [traitId: string]: number } = {};

  personalityTraits.forEach((trait) => {
    let highestScore = 0;
    friends.forEach((friend) => {
      const score = friendRatings[trait.id]?.[friend.id] || 0;
      if (score > highestScore) {
        highestScore = score;
      }
    });
    bestScoresPerTrait[trait.id] = highestScore;
  });

  friends.forEach((friend) => {
    let totalScore = 0;
    let traitCount = 0;

    personalityTraits.forEach((trait) => {
      const score = friendRatings[trait.id]?.[friend.id] || 0;
      if (score > 0) {
        totalScore += score;
        traitCount++;
      }
    });

    finalScores[friend.id] = {
      averageScore: traitCount > 0 ? totalScore / traitCount : 0,
      traits: {},
    };

    personalityTraits.forEach((trait) => {
      finalScores[friend.id].traits[trait.id] =
        friendRatings[trait.id]?.[friend.id] || 0;
    });
  });

  const awardedBadges = new Set<string>();

  const sortedRankings = Object.entries(finalScores)
    .sort((a, b) => b[1].averageScore - a[1].averageScore)
    .map(([friendId, data], index) => {
      const friend = friends.find((f) => f.id === friendId);

      const earnedBadges: string[] = [];

      personalityTraits.forEach((trait) => {
        const score = data.traits[trait.id];
        if (score === bestScoresPerTrait[trait.id] && !awardedBadges.has(trait.id)) {
          earnedBadges.push(trait.id);
          awardedBadges.add(trait.id);
        }
        if (score === 5 && !awardedBadges.has(`perfect-${trait.id}`)) {
          earnedBadges.push(`perfect-${trait.id}`);
          awardedBadges.add(`perfect-${trait.id}`);
        }
      });

      return {
        rank: index + 1,
        friend: friend ? friend.name : 'Inconnu',
        avatar: friend ? friend.avatar : null,
        averageScore: data.averageScore.toFixed(2),
        traits: data.traits,
        badges: earnedBadges,
      };
    });

  setFinalRankings(sortedRankings);
  setCurrentTraitIndex(null);

  await addDoc(collection(db, 'finalRankings'), {
    userId,
    finalRankings: sortedRankings,
    timestamp: serverTimestamp(),
    friendCount: friends.length,
    averageScore: sortedRankings.reduce((acc, curr) => acc + parseFloat(curr.averageScore), 0) / sortedRankings.length
  });
};