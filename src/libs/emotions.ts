const emotions = {
  happiness: 'happiness',
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
type emotions = (typeof emotions)[keyof typeof emotions];
export const emotionBackgorundColor = {
  happiness: '#FFD62B',
  gratitude: '#7DBCD7',
  serenity: '#B2A8D5',
  interest: '#FF9900',
  hope: '#E4404A',
  pride: '#88D3EB',
  amusement: '#827DFF',
  inspiration: '#827DFF',
  awe: '#C5EF68',
  love: '#FB4738',
};
export const emotionPointColor = {
  happiness: '#6B99FF',
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
export default emotions;
