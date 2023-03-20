import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {Avatar} from '../components/avatar';
import {Button} from '../components/button';
import {TextButton} from '../components/button/text-button';
import {Text} from '../components/text';
import colors from '../libs/colors';
import {svgs} from '../libs/images';

type ProfileTemplateProps = {};

function ProfileTemplate(props: ProfileTemplateProps): JSX.Element {
  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.profile}>
        <Avatar size={100} defaultLogo="m" />

        <View style={styles.profileContent}>
          <View style={styles.profileContentButton}>
            <Text color={colors.darkGrey} size={12}>
              이름
            </Text>
            <Text my={7}>피넛</Text>
            <TextButton hiddenBorder title="내 피넛카드 >" />
          </View>

          <View style={styles.profileContentButton}>
            <Text color={colors.darkGrey} size={12}>
              친구
            </Text>
            <Text my={7}>768</Text>
            <TextButton hiddenBorder title="친구 관리 >" />
          </View>
        </View>
      </View>

      <Button
        leftIcon={
          <WithLocalSvg
            asset={svgs.kakao}
            style={{marginLeft: -17}}
            width={85}
            height={42}
          />
        }
        color={colors.kakao}
        title="카카오톡 프로필 동기화"
        mt={30}
      />
      <Text size={10} color={colors.darkGrey} mt={7} ml={13}>
        피넛은 카카오톡 친구들과 함께하는 소셜 투표 서비스입니다.{'\n'}
        프로필은 카카오톡과 동기화해서 수정할 수 있습니다.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 16,
  },
  profile: {
    marginTop: 10,
    flexDirection: 'row',
  },
  profileContent: {
    marginLeft: 15,
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  profileContentButton: {flex: 1},
});

export default ProfileTemplate;
