import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WithLocalSvg} from 'react-native-svg';
import {svgs} from '../../libs/images';

type BackTopBar = {
  onBack?: () => void;
};

export const BackTopBar = (props: BackTopBar): JSX.Element => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, {marginTop: insets.top}]}>
      <TouchableOpacity onPress={props.onBack} style={styles.leftItem}>
        <WithLocalSvg width={7} height={14} asset={svgs.back} />
      </TouchableOpacity>
      <View></View>
      <View></View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftItem: {
    paddingHorizontal: 15,
  },
});
