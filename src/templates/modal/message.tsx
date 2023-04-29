import React from 'react';
import {Modal, StyleSheet, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import {colors} from '../../libs/common';
import {Gif} from '../../components/image';
import {Text} from '../../components/text';
import {Source} from 'react-native-fast-image';
import {MessageModalButtons} from '../../libs/stores/message-modal';

type MessageModalTemplateProps = {
  visible: boolean;

  message: string;
  buttons: MessageModalButtons;
  icon?: Source | number;
  onClose: () => void;
};

export const MessageModalTemplate = (props: MessageModalTemplateProps) => {
  return (
    <Modal
      transparent
      animationType="fade"
      onRequestClose={props.onClose}
      visible={props.visible}>
      <View style={styles.root}>
        <View style={styles.popup}>
          <Gif source={props.icon} />
          <Text mt={25} mb={25} align="center" mx={30}>
            {props.message}
          </Text>
          <View style={styles.buttons}>
            {props.buttons.map((x, i) => {
              return (
                <TouchableOpacity
                  key={i.toString()}
                  onPress={() => {
                    props.onClose();
                    if (x.onPress) {
                      x.onPress();
                    }
                  }}
                  style={[
                    styles.button,
                    i < props.buttons.length - 1 && styles.buttonBR,
                  ]}>
                  <Text weight="medium" color={x.color || colors.blue}>
                    {x.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

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
  buttons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.mediumGrey,
    alignSelf: 'stretch',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  buttonBR: {
    borderRightWidth: 1,
    borderRightColor: colors.mediumGrey,
  },
});
