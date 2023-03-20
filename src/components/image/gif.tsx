import React, {PropsWithChildren} from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

type GifProps = PropsWithChildren<{
  source: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
  size?: number;
}>;

export const Gif = (props: GifProps): JSX.Element => {
  return (
    <View style={props.style}>
      <Image
        source={props.source}
        style={[
          styles.gif,
          {width: props.size || 45, height: props.size || 45},
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  gif: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
});
