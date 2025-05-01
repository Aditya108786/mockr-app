
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { user_id, position, questions, answers, performance } = req.body;

  const { error, data } = await supabase.from('interviews').insert([
    {
      user_id,
      position,
      questions,
      answers,
      performance,
    },
  ]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: 'Interview saved successfully', data });
}
