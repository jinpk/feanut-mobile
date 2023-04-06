import {useEffect} from 'react';
import FastImage from 'react-native-fast-image';
import {getEmojis} from '../libs/api/common';
import {configs} from '../libs/common/configs';
import {useEmojiStore} from '../libs/stores';

export function useInitEmoji() {
  const update = useEmojiStore(s => s.actions.update);
  const initialize = useEmojiStore(s => s.actions.initialize);

  useEffect(() => {
    getEmojis({
      page: 1,
      // 하드코딩
      limit: 1000000000,
    }).then(res => {
      update(res.data);
      initialize();

      const uris = res.data.map(x => ({
        uri: configs.cdnBaseUrl + '/' + x.key,
      }));
      FastImage.preload(uris);
    });
  }, []);
  return [];
}
