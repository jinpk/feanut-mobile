import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WithLocalSvg} from 'react-native-svg';
import {svgs} from '../../libs/common';

type BackTopBar = {
  onBack?: () => void;
  logo?: boolean;
};

export const BackTopBar = (props: BackTopBar): JSX.Element => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, {marginTop: insets.top}]}>
      <TouchableOpacity onPress={props.onBack} style={[styles.leftItem]}>
        <WithLocalSvg width={7} height={14} asset={svgs.back} />
      </TouchableOpacity>
      <View>
        {props.logo && (
          <WithLocalSvg width={67.5} height={35} asset={svgs.logoWithLetter} />
        )}
      </View>
      <View />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  leftItem: {
    left: 0,
    position: 'absolute',
    paddingHorizontal: 15,
  },
});
