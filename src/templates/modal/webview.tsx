import React, {useEffect, useState} from 'react';
import {Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import WebView, {WebViewNavigation} from 'react-native-webview';
import {colors, svgs} from '../../libs/common';
import {WithLocalSvg} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Text} from '../../components/text';

type WebviewModalTemplateProps = {
  visible: boolean;
  onClose: () => void;
  uri: string;
};

export const WebviewModalTemplate = (
  props: WebviewModalTemplateProps,
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

          <WithLocalSvg
            style={styles.lock}
            asset={svgs.lock}
            width={14}
            height={14}
          />

          <View style={styles.navigation}>
            <Text numberOfLines={1} size={14}>
              {webview?.title}
            </Text>
            <Text numberOfLines={1} size={12} color={colors.darkGrey}>
              {webview?.url}
            </Text>
          </View>
        </View>
        <WebView
          source={{
            uri: props.uri,
          }}
          style={styles.webview}
          onNavigationStateChange={setWebview}
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
