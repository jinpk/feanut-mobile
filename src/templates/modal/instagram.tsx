import React from 'react';
import {Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import WebView from 'react-native-webview';
import {Gif} from '../../components/image';
import {Text} from '../../components/text';
import {colors, constants, gifs} from '../../libs/common';
import {configs} from '../../libs/common/configs';

type InstagramModalTemplateProps = {
  visible: boolean;
  onClose: () => void;
  onSucceed: () => void;
  state: string;
};

const INSTAGRAM_REDIRECT_URL = `${configs.apiBaseURL}/oauth/instagram`;
const INSTAGRAM_REDIRECT_SUCCESS_URL = `${INSTAGRAM_REDIRECT_URL}/success`;

export const InstagramModalTemplate = (
  props: InstagramModalTemplateProps,
): JSX.Element => {
  const handleClose = () => {
    props.onClose();
  };

  //const instaLogoutURL = 'https://instagram.com/accounts/logout';

  return (
    <Modal
      animationType="slide"
      visible={props.visible}
      transparent
      onRequestClose={handleClose}>
      <View style={styles.root}>
        <View style={styles.content}>
          <View style={styles.topbar}>
            <Text size={16} weight="medium">
              인스타그램 계정 연동
            </Text>
            <TouchableOpacity onPress={props.onClose} style={styles.close}>
              <Text color={colors.blue}>닫기</Text>
            </TouchableOpacity>
          </View>

          <WebView
            startInLoadingState
            renderLoading={() => (
              <Gif source={gifs.dolphin} size={30} style={styles.loading} />
            )}
            source={{
              uri: `https://api.instagram.com/oauth/authorize?client_id=${configs.instagramClientId}&redirect_uri=${INSTAGRAM_REDIRECT_URL}&scope=user_profile&response_type=code&state=${props.state}`,
            }}
            onNavigationStateChange={state => {
              if (state.url.startsWith(INSTAGRAM_REDIRECT_SUCCESS_URL)) {
                props.onSucceed();
                props.onClose();
              }
            }}
            style={styles.webview}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.dark + '3D',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
  },
  content: {
    backgroundColor: colors.white,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    height: constants.screenHeight * 0.85,
  },
  webview: {
    flex: 1,
  },
  topbar: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  close: {
    position: 'absolute',
    left: 16,
  },
  loading: {
    position: 'absolute',
    left: constants.screenWidth / 2 - 15,
    top: '30%',
  },
});
