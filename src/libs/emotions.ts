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
export default emotions;
