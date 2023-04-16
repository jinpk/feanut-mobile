import React from 'react';
import {Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import {colors, svgs} from '../../libs/common';
import {WithLocalSvg} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FastImage, {Source} from 'react-native-fast-image';

type ImageModalTemplateProps = {
  visible: boolean;
  onClose: () => void;
  source: undefined | Source | number;
};

export const ImageModalTemplate = (
  props: ImageModalTemplateProps,
): JSX.Element => {
  const insets = useSafeAreaInsets();

  const handleClose = () => {
    props.onClose();
  };

  return (
    <Modal
      animationType="fade"
      visible={props.visible}
      onRequestClose={handleClose}>
      <View
        style={[
          styles.root,
          {paddingTop: insets.top, paddingBottom: insets.bottom},
        ]}>
        <TouchableOpacity onPress={handleClose} style={styles.closeIcon}>
          <WithLocalSvg
            asset={svgs.close}
            width={15}
            height={15}
            color={colors.white}
          />
        </TouchableOpacity>
        <View style={styles.imageWrap}>
          <FastImage
            source={props.source}
            style={styles.image}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.black,
  },
  closeIcon: {
    paddingHorizontal: 16,
    paddingVertical: 19,
  },
  imageWrap: {
    paddingVertical: 20,
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
