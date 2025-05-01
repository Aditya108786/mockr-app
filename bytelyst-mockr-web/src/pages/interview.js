
// pages/interview.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/authcontext';
import { supabase } from '../lib/supabaseClient'; // Adjust the path if needed


const calculatePerformance = (answers) => {
  const scores = answers.map(answer => {
    const lengthScore = Math.min(answer.length / 200, 1) * 100;
    return Math.round(lengthScore);
  });

  return {
    frontend: scores[0] || 0,
    backend: scores[1] || 0,
    fullstack: scores[2] || 0,
    systemDesign: scores[3] || 0,
    futureGoals: scores[4] || 0,
  };
};

export default function Interview() {
  const { setInterviewAnswers, setPerformance, user: authUser } = useAuth();
  const [position, setPosition] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const router = useRouter();

  const fetchQuestions = async () => {
    const res = await fetch('/api/generateQuestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ position }),
    });

    const data = await res.json();
    if (!data.questions || data.questions.length === 0) {
      alert("Failed to generate questions. Please try again.");
      return;
    }
    setQuestions(data.questions);
  };

  const handleNext = async () => {
    if (answer.trim()) {
      const updatedAnswers = [...answers, answer];
      setAnswers(updatedAnswers);
      setInterviewAnswers(updatedAnswers);
      localStorage.setItem('interviewAnswers', JSON.stringify(updatedAnswers));
      setAnswer('');
  
      if (updatedAnswers.length === questions.length) {
        const scores = calculatePerformance(updatedAnswers);
        setPerformance(scores);
        localStorage.setItem('performance', JSON.stringify(scores));
  
        // ✅ Ensure user is in custom users table before submitting interview
        const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
        if (sessionError || !sessionData?.user) {
          console.error('Not logged in or session error', sessionError?.message);
          alert('You must be logged in to submit the interview.');
          return;
        }
  
        const user = sessionData.user;
  
        // Check if user already exists in your 'users' table
        const { data: existingUser, error: fetchUserError } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single();
  
        if (!existingUser) {
          // Insert user into custom 'users' table
          const { error: insertUserError } = await supabase.from('users').insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || '',
            profile_url: user.user_metadata?.avatar_url || '',
          });
  
          if (insertUserError) {
            console.error('Error inserting user into users table:', insertUserError.message);
            alert('Failed to register your profile. Try again.');
            return;
          }
        }
  
        // ✅ Insert interview
        const { error: insertInterviewError } = await supabase.from('interviews').insert({
          user_id: user.id,
          position,
          questions: questions,
          answers: updatedAnswers,
          performance: scores,
        });
  
        if (insertInterviewError) {
          console.error('Interview submission failed:', insertInterviewError.message);
          alert('Interview submission failed. Please try again.');
          return;
        }
  
        // Redirect to feedback page
        router.push('/feedback');
      } else {
        setCurrentQuestion(currentQuestion + 1);
      }
    }
  };
  
  if (!questions.length) {
    return (
      <div className="max-w-xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Start Interview</h1>
        <input
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Enter job position (e.g., Frontend Developer)"
        />
        <button
          onClick={fetchQuestions}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          disabled={!position.trim()}
        >
          Generate Questions
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Interview - {position}</h1>
      <div className="bg-white rounded-xl shadow-md p-8">
        <p className="mb-4 text-black text-sm">
          Question {currentQuestion + 1} of {questions.length}
        </p>
        <h2 className="text-xl text-black font-semibold mb-4">{questions[currentQuestion]}</h2>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows="4"
          className="w-full p-2 text-green-500 border border-gray-300 rounded-lg"
          placeholder="Type your answer here..."
        />
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {currentQuestion === questions.length - 1 ? 'Submit Interview' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
}
