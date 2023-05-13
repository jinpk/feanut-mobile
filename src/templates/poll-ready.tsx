import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Gif} from '../components/image';
import {Text} from '../components/text';
import {constants, gifs, pngs} from '../libs/common';

type PollReadyTemplateProps = {
  onSchoolVote: () => void;
  onFriendVote: () => void;
};

function PollReadyTemplate(props: PollReadyTemplateProps): JSX.Element {
  return (
    <View style={styles.root}>
      <Gif source={gifs.teddyBear} />
      <Text mt={14} size={18} weight="bold" align="center">
        투표 준비가 완료되었어요!
      </Text>
      <View style={styles.targets}>
        <TouchableOpacity
          onPress={props.onSchoolVote}
          style={[
            styles.target,
            {
              backgroundColor: 'rgba(255, 153, 0, 0.2)',
            },
          ]}>
          <Gif size={54} source={pngs.school} />
          <Text mt={12} align="center">
            <Text weight="bold">학교 친구</Text>
            {'\n'}
            투표하기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={props.onFriendVote}
          style={[
            styles.target,
            {
              backgroundColor: 'rgba(255, 214, 43, 0.2)',
            },
          ]}>
          <View style={styles.emojis}>
            <Gif size={52} source={gifs.boy} />
            <Gif size={52} source={gifs.girl} />
          </View>
          <Text mt={12} align="center">
            <Text weight="bold">내 친구</Text>
            {'\n'}
            투표하기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targets: {
    flexDirection: 'row',
    marginTop: 50,
    marginBottom: 50,
    alignItems: 'center',
  },
  target: {
    width: constants.screenWidth * 0.39,
    borderRadius: 15,
    height: constants.screenWidth * 0.39,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojis: {
    flexDirection: 'row',
  },
});

export default PollReadyTemplate;
