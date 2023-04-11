import React from 'react';
import {Modal, StyleSheet, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import {colors, gifs} from '../../libs/common';
import {Gif} from '../../components/image';
import {Text} from '../../components/text';

type OpenModalTemplateProps = {
  visible: boolean;
  name: string;
  onClose: () => void;
  onProfile: () => void;
};

function OpenModalTemplate(props: OpenModalTemplateProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      onRequestClose={props.onClose}
      visible={props.visible}>
      <View style={styles.root}>
        <View style={styles.popup}>
          <Gif source={gifs.partyPopper} />
          <Text mt={25} mb={25} align="center">
            <Text weight="medium">{props.name}</Text> 님이
            {'\n'}투표에서 나를 선택했어요!
            {'\n\n'}프로필이 궁금하다면?
          </Text>
          <TouchableOpacity
            onPress={() => {
              props.onClose();
              props.onProfile();
            }}
            style={styles.button}>
            <Text weight="medium" color={colors.blue}>
              프로필 확인하기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.dark + '4D',
    alignItems: 'center',
    justifyContent: 'center',
  },

  popup: {
    alignSelf: 'stretch',
    marginHorizontal: '13%',
    borderRadius: 15,
    backgroundColor: colors.white,
    paddingTop: 25,
    alignItems: 'center',
  },
  button: {
    alignSelf: 'stretch',
    borderTopWidth: 1,
    borderTopColor: colors.mediumGrey,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
});

export default OpenModalTemplate;
