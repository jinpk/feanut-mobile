import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {Text} from '../../../components/text';
import {BackTopBar} from '../../../components/top-bar';
import routes from '../../../libs/routes';
import InputConfirmTemplate from '../../../templates/input-confirm';

function LoginEmail(): JSX.Element {
  const navigation = useNavigation();

  const handleConfirm = () => {
    navigation.navigate(routes.loginEmailVerification);
  };

  return (
    <View style={{flex: 1}}>
      <BackTopBar onBack={navigation.goBack} />
      <InputConfirmTemplate
        title="회원님의 이메일 주소를 입력해 주세요."
        label={
          <Text>
            입력하신 주소는 <Text weight="bold">feanut ID</Text>로 사용됩니다.
          </Text>
        }
        placeholder="hi@feanut.com"
        onConfirm={handleConfirm}
      />
    </View>
  );
}

export default LoginEmail;