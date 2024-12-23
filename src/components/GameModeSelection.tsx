import { useRouter } from 'next/router';
import { FaExchangeAlt } from 'react-icons/fa';
import { MdCategory, MdFormatListBulleted, MdInsights, MdGroup } from 'react-icons/md';
import styles from '../styles/GameModeSelection.module.css';
import SignOut from './SignOut'; // Import SignOut component

export default function GameModeSelection() {
  const router = useRouter();

  const gameModes = [
    {
      title: 'Mode Versus',
      description: 'Comparez deux amis entre eux',
      path: '/app/versus',
      startColor: '#7F7FD5',
      endColor: '#91EAE4',
      iconColor: '#7F7FD5',
      icon: FaExchangeAlt
    },
    {
      title: 'Mode Thématique',
      description: 'Classez vos amis par thème',
      path: '/app/themed',
      startColor: '#2193b0',
      endColor: '#6dd5ed',
      iconColor: '#2193b0',
      icon: MdCategory
    },
    {
      title: 'Mode Libre',
      description: 'Classement libre de vos amis',
      path: '/app/free',
      startColor: '#764BA2',
      endColor: '#667EEA',
      iconColor: '#764BA2',
      icon: MdFormatListBulleted
    },
    {
      title: 'Analyses & Conseils',
      description: 'Consultez les classements précédents',
      path: '/app/analysis',
      startColor: '#11998e',
      endColor: '#38ef7d',
      iconColor: '#11998e',
      icon: MdInsights
    },
    {
      title: 'Gestion des Amis',
      description: 'Gérez votre liste d\'amis et leurs scores',
      path: '/app/friends-management',
      startColor: '#FF8C00',
      endColor: '#FFA500',
      iconColor: '#FF8C00',
      icon: MdGroup
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Sélectionnez un mode de jeu</h1>
        <div className={styles.signOutWrapper}>
          <SignOut className={styles.signOut} /> {/* Move SignOut button here */}
        </div>
      </div>
      <div className={styles.grid}>
        {gameModes.map((mode) => {
          const Icon = mode.icon;
          return (
            <div
              key={mode.path}
              className={styles.card}
              onClick={() => mode.path && router.push(mode.path)}
              style={{
                '--start-color': mode.startColor,
                '--end-color': mode.endColor,
                '--icon-color': mode.iconColor
              } as React.CSSProperties}
            >
              <div className={styles.iconWrapper}>
                <Icon className={styles.icon} />
              </div>
              <div className={styles.content}>
                <h2>{mode.title}</h2>
                <p>{mode.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
