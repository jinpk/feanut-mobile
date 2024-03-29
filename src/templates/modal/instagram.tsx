import React, {useEffect, useState} from 'react';
import {Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import WebView, {WebViewNavigation} from 'react-native-webview';
import {colors, svgs} from '../../libs/common';
import {WithLocalSvg} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Text} from '../../components/text';
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
  const [webview, setWebview] = useState<WebViewNavigation | undefined>();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!props.visible) {
      setWebview(undefined);
    }
  }, [props.visible]);

  const handleClose = () => {
    props.onClose();
  };

  return (
    <Modal
      animationType="slide"
      visible={props.visible}
      transparent
      onRequestClose={handleClose}>
      <View style={styles.root}>
        <View style={[styles.topbar, {marginTop: insets.top}]}>
          <TouchableOpacity onPress={handleClose} style={styles.closeIcon}>
            <WithLocalSvg
              asset={svgs.close}
              width={15}
              height={15}
              color={colors.dark}
            />
          </TouchableOpacity>

          <Text size={16} weight="medium">
            인스타그램 계정 연결
          </Text>
        </View>

        <WebView
          startInLoadingState
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  webview: {
    flex: 1,
  },
  topbar: {
    alignItems: 'center',
    height: 53,
    borderBottomColor: colors.mediumGrey,
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  close: {
    position: 'absolute',
    left: 16,
  },
  closeIcon: {
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  lock: {
    marginHorizontal: 6,
  },
  navigation: {
    flex: 1,
    paddingRight: 15,
  },
});
