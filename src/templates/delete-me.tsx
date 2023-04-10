import {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Avatar, KeyboardLayout, Radios} from '../components';
import {Button} from '../components/button';
import {TextInput} from '../components/input';
import {Text} from '../components/text';
import {BackTopBar} from '../components/top-bar';
import {colors} from '../libs/common';
import {configs} from '../libs/common/configs';
import {useProfileStore} from '../libs/stores';
import {getObjectURLByKey} from '../libs/common/file';

type DeleteMeTemplateProps = {
  reason: string;
  onReasonChange: (value: string) => void;
  onBack: () => void;
  onDelete: () => void;
  name: string;
};

function DeleteMeTemplate(props: DeleteMeTemplateProps) {
  const [agreed, setAgreed] = useState(false);
  const profileImageKey = useProfileStore(s => s.profile.profileImageKey);
  const gender = useProfileStore(s => s.profile.gender);

  return (
    <KeyboardLayout style={styles.root}>
      <BackTopBar title="회원탈퇴" onBack={props.onBack} />
      <View style={styles.body}>
        <Avatar
          size={100}
          defaultLogo={gender === 'male' ? 'm' : 'w'}
          uri={getObjectURLByKey(profileImageKey, '150')}
        />
        <Text mt={24} weight="bold" size={18} align="center">
          {props.name}님, feanut 계정을 정말{'\n'}
          <Text weight="bold" size={18} color={colors.red}>
            탈퇴{' '}
          </Text>
          하시겠습니까?
        </Text>

        <View style={styles.content}>
          <Text size={12} mt={30} mb={5} color={colors.darkGrey}>
            feanut을 탈퇴하면
          </Text>

          <View style={styles.ol}>
            <View style={styles.li} />
            <Text weight="medium">
              친구에게 받은 소중한 투표 이력은 전부 삭제됩니다.
            </Text>
          </View>
          <View style={styles.ol}>
            <View style={styles.li} />
            <Text weight="medium">보유중인 코인은 전부 소멸됩니다.</Text>
          </View>

          <Text size={12} mt={45} mb={5} color={colors.darkGrey}>
            탈퇴하시는 이유를 알려주세요.
          </Text>

          <TextInput
            value={props.reason}
            onChange={props.onReasonChange}
            placeholder="10자 이상 입력해 주세요"
            maxLength={100}
            onBlur={() => {
              props.onReasonChange(props.reason.trim());
            }}
            mt={7}
            hiddenClose
          />
        </View>
        <View style={styles.padding} />

        <Radios
          value={agreed}
          onChagne={() => {
            setAgreed(prev => !prev);
          }}
          fontSize={12}
          data={[{label: '모든 정보를 삭제하는 것에 동의합니다.', value: true}]}
        />
        <Button
          onPress={props.onDelete}
          color={colors.red}
          title="feanut 탈퇴"
          disabled={!agreed || !props.reason}
          mt={14}
          mb={15}
        />
      </View>
    </KeyboardLayout>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.white,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
  },
  content: {
    alignSelf: 'stretch',
  },
  padding: {flex: 1, paddingTop: 30},
  ol: {flexDirection: 'row', marginTop: 10, alignItems: 'center'},
  li: {
    borderRadius: 10,
    width: 4,
    height: 4,
    backgroundColor: colors.dark,
    marginRight: 13,
  },
});

export default DeleteMeTemplate;
