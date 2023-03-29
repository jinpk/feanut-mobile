import {useEffect} from 'react';
import {postPollingRound} from '../libs/api/poll';
import {useEmojiStore, useUserStore} from '../libs/stores';

export function usePolling() {
  const userId = useUserStore(s => s.user?.id);
  const emojis = useEmojiStore(s => s.emojis);

  const fetchUserRound = async () => {
    try {
      const pollingRound = await postPollingRound();
      console.log(pollingRound);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserRound();
    }
  }, []);

  console.log(emojis);
}
