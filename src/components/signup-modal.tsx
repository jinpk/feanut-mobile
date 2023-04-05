import React from 'react';
import {Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {colors, svgs} from '../libs/common';
import {Button} from './button';
import Terms from './terms';
import {Text} from './text';

type SignUpModalProps = {
  visible: boolean;
  onClose: () => void;
  username: string;

  onSignUp: () => void;
  onPrivacyTerm: () => void;
  onServiceTerm: () => void;
};

export const SignUpModal = (props: SignUpModalProps) => {
  return (
    <Modal
      visible={props.visible}
      onRequestClose={props.onClose}
      transparent
      animationType="slide">
      <View style={styles.root}>
        <View style={styles.content}>
          <TouchableOpacity onPress={props.onClose} style={styles.close}>
            <WithLocalSvg asset={svgs.close} width={8.4} height={8.4} />
          </TouchableOpacity>
          <WithLocalSvg width={58} height={30} asset={svgs.logo} />
          <Text mt={30} weight="bold" size={18}>
            Welcome to feanut!
          </Text>
          <Text align="center" my={60}>
            <Text weight="bold">@{props.username}</Text> 아직 가입되지 않은
            ID입니다.
            {'\n'}
            {'\n'}
            지금 바로 가입하고{'\n'}다양한 주제의 투표를 통해 친구 몰래{'\n'}
            마음을 표현해 보세요!
          </Text>
          <Button onPress={props.onSignUp} title="가입하기" />
          <Terms {...props} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.dark + '4D',
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: colors.white,
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
    alignItems: 'center',
    padding: 15,
    paddingBottom: 50,
  },
  close: {
    width: 21,
    height: 21,
    borderRadius: 100,
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
});
