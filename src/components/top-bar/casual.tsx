import {StyleSheet, View} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import LogoSvg from '../../assets/svgs/logo.svg';
import LogoLetterSvg from '../../assets/svgs/logo-letter.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const CasualTopBar = (): JSX.Element => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, {paddingTop: insets.top + 70}]}>
      <WithLocalSvg width={30} height={15} asset={LogoSvg} />
      <WithLocalSvg
        width={60}
        height={15}
        asset={LogoLetterSvg}
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
    paddingVertical: 70,
    flexDirection: 'row',
  },
  letter: {
    marginLeft: 8,
  },
});
