import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {Text} from '../../../components/text';
import {BackTopBar} from '../../../components/top-bar';
import routes from '../../../libs/routes';
import InputConfirmTemplate from '../../../templates/input-confirm';

function LoginEmailVerification(): JSX.Element {
  const navigation = useNavigation();

  const handleConfirm = () => {
    navigation.reset({index: 0, routes: [{name: routes.welcome}]});
  };

  return (
    <View style={{flex: 1}}>
      <BackTopBar onBack={navigation.goBack} />
      <InputConfirmTemplate
        title="인증번호가 발송되었습니다."
        label={
          <Text>
            <Text weight="bold">van-f.com</Text>으로 인증번호를 보내드렸어요.
          </Text>
        }
        message="3분 이내로 인증번호(6자리)를 입력해 주세요."
        placeholder="hi@feanut.com"
        onConfirm={handleConfirm}
      />
    </View>
  );
}

export default LoginEmailVerification;
