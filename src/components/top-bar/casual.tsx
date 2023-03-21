import {StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import LogoSvg from '../../assets/svgs/logo.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {svgs} from '../../libs/images';
import colors from '../../libs/colors';

type CasualTopBarProps = {
  onClose?: () => void;
};

export const CasualTopBar = (props: CasualTopBarProps): JSX.Element => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, {paddingTop: insets.top + 16}]}>
      <StatusBar barStyle="dark-content" />
      {props.onClose && (
        <TouchableOpacity
          onPress={props.onClose}
          style={[styles.close, {marginTop: insets.top}]}>
          <WithLocalSvg width={14} height={14} asset={svgs.close} />
        </TouchableOpacity>
      )}
      <WithLocalSvg width={30} height={15} asset={LogoSvg} />
      <WithLocalSvg
        width={60}
        height={15}
        fill={colors.dark}
        asset={svgs.logoLetterBlack}
        style={styles.letter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  letter: {
    marginLeft: 8,
  },
  close: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 16,
  },
});
