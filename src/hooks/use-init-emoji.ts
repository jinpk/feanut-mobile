import {useEffect} from 'react';
import FastImage from 'react-native-fast-image';
import {getEmojis} from '../libs/api/common';
import {configs} from '../libs/common/configs';

export function useInitEmoji() {
  useEffect(() => {
    const fetchEmojis = (page: number, limit: number) => {
      console.log('fetched emoji query: ', {page, limit});
      getEmojis({
        page,
        limit,
      })
        .then(res => {
          const uris = res.data.map(x => ({
            uri: configs.cdnBaseUrl + '/' + x.assetKey,
          }));

          FastImage.preload(uris);

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
