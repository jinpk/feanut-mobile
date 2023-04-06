import {useEffect, useState} from 'react';
import {configs} from '../libs/common/configs';
import {useEmojiStore} from '../libs/stores';

export function useGetEmojiURI(emojiId?: string): string {
  const emojis = useEmojiStore(s => s.emojis);
  const [emojiURL, setEmojiURL] = useState('');
  useEffect(() => {
    if (emojiId) {
      const emoji = emojis.find(x => x.id === emojiId);
      if (emoji) {
        setEmojiURL(configs.cdnBaseUrl + '/' + emoji.key);
      }
    }
  }, [emojis, emojiId]);

  return emojiURL;
}
