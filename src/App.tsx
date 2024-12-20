// filepath: /c:/Pierre_Project/friend-ranking-app/src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FriendRankingApp from './components/FriendRankingApp';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/app" element={<FriendRankingApp />} />
      </Routes>
    </Router>
  );
};

export default App;