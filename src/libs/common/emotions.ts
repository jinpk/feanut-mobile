import {Colors} from '../interfaces';

export const emotions = {
  joy: 'joy',
  gratitude: 'gratitude',
  serenity: 'serenity',
  interest: 'interest',
  hope: 'hope',
  pride: 'pride',
  amusement: 'amusement',
  inspiration: 'inspiration',
  awe: 'awe',
  love: 'love',
};

export type emotions = (typeof emotions)[keyof typeof emotions];

export const emotionBackgorundColor: Colors = {
  joy: '#FFD62B',
  gratitude: '#7DBCD7',
  serenity: '#B2A8D5',
  interest: '#FF9900',
  hope: '#E4404A',
  pride: '#88D3EB',
  amusement: '#FFBCCE',
  inspiration: '#827DFF',
  awe: '#C5EF68',
  love: '#FB4738',
};

export const emotionPointColor: Colors = {
  joy: '#6B99FF',
  gratitude: '#D1C5AE',
  serenity: '#CDCF70',
  interest: '#40BEFF',
  hope: '#0FC45E',
  pride: '#0075FF',
  amusement: '#FE8709',
  inspiration: '#FBE338',
  awe: '#FF7569',
  love: '#9BEA77',
};

export const emotionKRLabel = {
  joy: '기쁨',
  gratitude: '감사',
  serenity: '평온',
  interest: '관심',
  hope: '희망',
  pride: '자부심',
  amusement: '즐거움',
  inspiration: '영감',
  awe: '놀람',
  love: '사랑',
};

export const emotionKRMessage = {
  joy: '밝은 에너지를\n전해주는 사람',
  gratitude: '항상 고마움을\n전하는 사람',
  serenity: '항상 편안함을\n주는 사람',
  interest: '흥미와 관심을\n받는 사람',
  hope: '무한한 희망을\n주는 사람',
  pride: '항상 자신감을\n주는 사람',
  amusement: '늘 즐거움을\n주는 사람',
  inspiration: '무한한 영감을\n주는 사람',
  awe: '새로운 놀라움을\n주는 사람',
  love: '열렬한 사랑을\n받는 사람',
};
