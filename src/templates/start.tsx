import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WithLocalSvg} from 'react-native-svg';
import {Button} from '../components/button';
import {Gif} from '../components/image';
import {colors, gifs, svgs} from '../libs/common';
import {Terms} from '../components';
import {TextButton} from '../components/button/text-button';
import {Text} from '../components/text';

type StartTemplateProps = {
  onPrivacy: () => void;
  onTerms: () => void;
  onStart: () => void;
  onLogin: () => void;
};

function StartTemplate(props: StartTemplateProps): JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, {paddingTop: insets.top}]}>
      <StatusBar barStyle="dark-content" backgroundColor={'#fff'} />

      <View style={styles.body}>
        <View style={[styles.header]}>
          <WithLocalSvg width={58} height={30} asset={svgs.logo} />
          <WithLocalSvg
            width={76}
            height={20}
            style={styles.logo}
            fill={colors.dark}
            asset={svgs.logoLetterBlack}
          />

          <Gif source={gifs.wavingHand} style={styles.waving} />
        </View>

        <View>
          <Terms
            onPrivacyTerm={props.onPrivacy}
            onServiceTerm={props.onTerms}
          />
          <Button
            mt={30}
            onPress={props.onStart}
            title={'휴대폰번호로 시작하기'}
          />
        </View>

        <View style={styles.login}>
          <Text size={12}>이미 feanut에 가입한적 있으신가요? </Text>
          <TextButton title="로그인하기" onPress={props.onLogin} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  login: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
  },
  logo: {marginTop: 9},
  waving: {
    marginTop: 50,
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
  },
  button: {},
});

export default StartTemplate;
