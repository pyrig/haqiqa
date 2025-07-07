
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUsernameCheck = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const checkUsername = async (username: string) => {
    if (!username || username.trim().length < 3) {
      setIsAvailable(null);
      return;
    }

    setIsChecking(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase())
        .maybeSingle();

      if (error) {
        console.error('Error checking username:', error);
        setIsAvailable(null);
        return;
      }

      setIsAvailable(!data);
    } catch (error) {
      console.error('Error checking username:', error);
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  };

  return {
    checkUsername,
    isChecking,
    isAvailable,
    resetCheck: () => setIsAvailable(null),
  };
};
