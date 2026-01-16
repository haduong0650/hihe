import { useState } from 'react';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import LoginForm from '@/components/LoginForm';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <LoginForm
      email={email}
      password={password}
      error={error}
      onChangeEmail={(e) => setEmail(e.target.value)}
      onChangePassword={(e) => setPassword(e.target.value)}
      onSubmit={handleLogin}
    />
  );
}
