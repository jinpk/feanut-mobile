import {useEffect} from 'react';
import FastImage from 'react-native-fast-image';
import {getEmojis} from '../libs/api/common';
import {configs} from '../libs/common/configs';
import {useEmojiStore} from '../libs/stores';

export function useInitEmoji() {
  const update = useEmojiStore(s => s.actions.update);
  const push = useEmojiStore(s => s.actions.push);

  useEffect(() => {
    const fetchEmojis = (page: number, limit: number) => {
      console.log('fetched emoji query: ', {page, limit});
      getEmojis({
        page,
        limit,
      })
        .then(res => {
          const uris = res.data.map(x => ({
            uri: configs.cdnBaseUrl + '/' + x.key,
          }));

          FastImage.preload(uris);

          // set to store
          if (page === 1) {
            update(res.data);
          } else {
            push(res.data);
          }

          if (res.total > page * limit) {
            let tm = setTimeout(() => {
              clearTimeout(tm);
              fetchEmojis(page + 1, limit);
            }, 1000);
          }
        })
        .catch(hi => {});
    };

    fetchEmojis(1, 10);
  }, []);
  return [];
}
