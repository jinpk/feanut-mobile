import {StyleSheet, View} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {Text} from '../text';
import LogoSvg from '../../assets/svgs/logo.svg';
import LogoLetterSvg from '../../assets/svgs/logo-letter.svg';

export const CasualTopBar = (): JSX.Element => {
  return (
    <View style={styles.root}>
      {
        //        <WithLocalSvg width={30} height={15} asset={LogoSvg} />
      }
      {
        //<LogoLetterSvg />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    paddingVertical: 70,
  },
});
