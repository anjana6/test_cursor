import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return <AuthForm isLogin={isLogin} onToggleMode={toggleMode} />;
};

export default LoginPage;
