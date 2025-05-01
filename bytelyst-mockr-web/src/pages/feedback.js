
import { useAuth } from '../context/authcontext';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const calculatePerformance = (answers, position) => {
  // Example performance calculation based on answer length
  const scores = answers.map(answer => {
    const lengthScore = Math.min(answer.length / 200, 1) * 100;
    return Math.round(lengthScore);
  });

  // Calculate performance dynamically based on the position
  return {
    [position]: scores.reduce((acc, score) => acc + score, 0) / scores.length || 0,
  };
};

export default function Feedback() {
  const { user, interviewAnswers, performance } = useAuth();
  const [answers, setAnswers] = useState([]);
  const [position, setPosition] = useState('');
  const [scores, setScores] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchInterviewData = async () => {
      if (!user) {
        router.push('/login');
        return;
      }

      // Fetch interview data from Supabase based on user_id
      const { data, error } = await supabase
        .from('interviews')
        .select('answers, performance, position')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching interview data:', error.message);
        alert('Failed to load interview data. Please try again.');
        return;
      }

      if (data) {
        setAnswers(data.answers || []);
        setPosition(data.position || ''); // Use position from interview data
        setScores(data.performance || {}); // Set performance if available
      } else {
        alert('No interview data found for this user.');
        router.push('/interview');
      }
    };

    if (!interviewAnswers.length && !performance) {
      fetchInterviewData();
    } else {
      setAnswers(interviewAnswers);
      setScores(performance);
    }
  }, [user, interviewAnswers, performance, router]);

  useEffect(() => {
    if (answers.length > 0 && position) {
      const calculatedScores = calculatePerformance(answers, position);
      setScores(calculatedScores);
      // Optionally, save performance back to Supabase if needed
    }
  }, [answers, position]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Feedback</h1>
      <div className="bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Performance</h2>

        <div className="space-y-4 text-gray-700">
          {position && (
            <div className="flex justify-between border-b pb-2">
              <span>{position} Mock Interview</span>
              <span className="text-green-600 font-semibold">{scores[position] || 0}%</span>
            </div>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2 text-black">Your Answers:</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {answers.map((answer, idx) => (
              <li key={idx}>{answer}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
