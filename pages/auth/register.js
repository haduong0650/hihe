import { useState } from 'react';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import RegisterForm from '@/components/RegisterForm';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      router.push('/auth/login');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <RegisterForm
      email={email}
      password={password}
      error={error}
      onChangeEmail={(e) => setEmail(e.target.value)}
      onChangePassword={(e) => setPassword(e.target.value)}
      onSubmit={handleRegister}
    />
  );
}
