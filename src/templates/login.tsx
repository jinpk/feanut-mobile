import {GestureResponderEvent, StyleSheet, View} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {Button} from '../components/button';
import {TextButton} from '../components/button/text-button';
import {Gif} from '../components/image';
import {Text} from '../components/text';
import {CasualTopBar} from '../components/top-bar';
import colors from '../libs/colors';
import {gifs, svgs} from '../libs/images';

type LoginTemplateProps = {
  onKakaoLogin: (e: GestureResponderEvent) => void;
  onAppleLogin: (e: GestureResponderEvent) => void;
  onEmailLogin: (e: GestureResponderEvent) => void;
  onPrivacyTerm: (e: GestureResponderEvent) => void;
  onServiceTerm: (e: GestureResponderEvent) => void;
};

function LoginTemplate(props: LoginTemplateProps): JSX.Element {
  return (
    <View style={styles.root}>
      <CasualTopBar />
      <Gif source={gifs.wavingHand} />

      <Button
        onPress={props.onKakaoLogin}
        leftIcon={
          <WithLocalSvg
            asset={svgs.kakao}
            style={{marginLeft: -17}}
            width={85}
            height={42}
          />
        }
        color={colors.kakao}
        title="카카오 시작하기"
        mx={16}
        mt={120}
      />
      <Button
        onPress={props.onAppleLogin}
        leftIcon={<WithLocalSvg asset={svgs.apple} width={14} height={16.6} />}
        color={colors.black}
        title="Apple 로그인"
        mx={16}
        mt={15}
      />
      <Button
        onPress={props.onEmailLogin}
        color={colors.mediumGrey}
        title="이메일 로그인"
        mx={16}
        mt={15}
      />

      <View style={styles.terms}>
        <TextButton onPress={props.onPrivacyTerm} title="개인정보 처리방침" />
        <Text size={12}>과 </Text>
        <TextButton onPress={props.onServiceTerm} title="서비스 이용약관" />
        <Text size={12}>에 동의합니다.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
  },
  terms: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default LoginTemplate;
