import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WithLocalSvg} from 'react-native-svg';
import {svgs} from '../../libs/images';
import {Text} from '../text';

type MainTopBar = {
  onInboxPress: () => void;
  onProfilePress: () => void;
};

export const MainTopBar = (props: MainTopBar): JSX.Element => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, {marginTop: insets.top}]}>
      <TouchableOpacity onPress={props.onInboxPress} style={styles.optionItem}>
        <Text weight="medium">수신함</Text>
      </TouchableOpacity>
      <View>
        <WithLocalSvg width={67} height={35} asset={svgs.logoWithLetter} />
      </View>
      <TouchableOpacity
        onPress={props.onProfilePress}
        style={styles.optionItem}>
        <Text weight="medium">프로필</Text>
      </TouchableOpacity>
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
  optionItem: {
    paddingHorizontal: 15,
  },
});
