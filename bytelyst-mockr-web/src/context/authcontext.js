
// context/authContext.js
import { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Adjust relative path based on your file location

const AuthContext = createContext({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  interviewAnswers: [],
  setInterviewAnswers: () => {},
  performance: null,
  setPerformance: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [interviewAnswers, setInterviewAnswers] = useState([]);
  const [performance, setPerformance] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw new Error(error.message);
        if (data.session) {
          setUser(data.session.user);
        }
      } catch (error) {
        console.error('Error fetching session:', error.message);
      }

      const storedAnswers = localStorage.getItem('interviewAnswers');
      const storedPerformance = localStorage.getItem('performance');
      try {
        if (storedAnswers) setInterviewAnswers(JSON.parse(storedAnswers));
        if (storedPerformance) setPerformance(JSON.parse(storedPerformance));
      } catch (error) {
        console.error('Error parsing localStorage data:', error.message);
      }
    };

    fetchSession();
  }, []); // Ensures this runs only once after component mounts

  const login = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);
      setUser(data.user);
    } catch (err) {
      console.error('Login error:', err.message);
      throw new Error('Login failed. Please check your credentials.');
    }
  };

  const register = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        
      });
      if (error) throw new Error(error.message);
      setUser(data.user);
    } catch (err) {
      console.error('Registration error:', err.message);
      throw new Error('Registration failed. Please try again.');
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setInterviewAnswers([]);
      setPerformance(null);
      localStorage.removeItem('interviewAnswers');
      localStorage.removeItem('performance');
    } catch (err) {
      console.error('Logout error:', err.message);
    }
  };

  const saveInterviewAnswers = (answers) => {
    setInterviewAnswers(answers);
    localStorage.setItem('interviewAnswers', JSON.stringify(answers));
  };

  const savePerformance = (data) => {
    setPerformance(data);
    localStorage.setItem('performance', JSON.stringify(data));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        interviewAnswers,
        setInterviewAnswers: saveInterviewAnswers,
        performance,
        setPerformance: savePerformance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
