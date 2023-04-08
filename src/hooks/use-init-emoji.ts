import {useEffect} from 'react';
import {getEmojis} from '../libs/api/common';
import {useEmojiStore} from '../libs/stores';

export function useInitEmoji() {
  const update = useEmojiStore(s => s.actions.update);
  const initialize = useEmojiStore(s => s.actions.initialize);

  useEffect(() => {
    getEmojis({}).then(res => {
      update(res.data);
      initialize();
    });
  }, []);
}
