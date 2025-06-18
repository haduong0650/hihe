import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
    } else {
      router.push('/login');
    }
  };

  return <button onClick={handleLogout}>Đăng Xuất</button>;
}