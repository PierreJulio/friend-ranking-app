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

export const selectNextFriendToRate = (
  friends: { id: string; name: string; avatar: string | null }[],
  friendRatings: { [traitId: string]: { [friendId: string]: number } },
  usedQuestions: { [traitId: string]: Set<number> },
  setUsedQuestions: (value: { [traitId: string]: Set<number> } | ((prev: { [traitId: string]: Set<number> }) => { [traitId: string]: Set<number> })) => void,
  setCurrentQuestion: (value: string | null) => void,
  setCurrentRandomFriend: (value: string | null) => void,
  trait: { id: string; name: string; description: string; questions: string[] }
) => {
  const friendsToRate = friends.filter(friend => !(friendRatings[trait.id]?.[friend.id]));
  if (friendsToRate.length === 0) return null;

  const nextFriend = friendsToRate[Math.floor(Math.random() * friendsToRate.length)];

  let used = usedQuestions[trait.id] || new Set<number>();
  let availableQuestionIndices = trait.questions.map((_, index) => index).filter(index => !used.has(index));

  if (availableQuestionIndices.length === 0) {
    used = new Set<number>();
    availableQuestionIndices = trait.questions.map((_, index) => index);
  }

  const questionIndex = availableQuestionIndices[Math.floor(Math.random() * availableQuestionIndices.length)];
  const question = trait.questions[questionIndex].replace('{friend}', nextFriend.name);

  used.add(questionIndex);
  setUsedQuestions((prev: { [traitId: string]: Set<number> }) => ({ ...prev, [trait.id]: used }));
  setCurrentQuestion(question);
  setCurrentRandomFriend(nextFriend.id);

  return nextFriend.id;
};

export async function calculateFinalRankings(
  friends: { id: string; name: string; avatar: string | null }[],
  friendRatings: { [traitId: string]: { [friendId: string]: number } },
  setFinalRankings: React.Dispatch<React.SetStateAction<Ranking[] | null>>,
  setCurrentTraitIndex: React.Dispatch<React.SetStateAction<number | null>>,
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