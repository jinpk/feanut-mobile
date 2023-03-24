import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {Avatar} from '../components/avatar';
import {BadgeButton, Button} from '../components/button';
import {TextButton} from '../components/button/text-button';
import {Divider} from '../components';
import {InputSwitch} from '../components/input';
import {Text} from '../components/text';
import Switch from '../components/switch';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, svgs} from '../libs/common';

type ProfileTemplateProps = {};

function ProfileTemplate(props: ProfileTemplateProps): JSX.Element {
  const insets = useSafeAreaInsets();
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
      <Text size={10} mb={20} color={colors.darkGrey} mt={7} ml={13}>
        피넛은 카카오톡 친구들과 함께하는 소셜 투표 서비스입니다.{'\n'}
        프로필은 카카오톡과 동기화해서 수정할 수 있습니다.
      </Text>

      <InputSwitch label="상태 메시지" value="피넛 투표 기다리는중 ㅎㅎ" />

      <View style={styles.feanut}>
        <View style={styles.feanutContent}>
          <View>
            <Text color={colors.darkGrey} size={12}>
              보유 피넛
            </Text>
            <Text mt={7}>23</Text>
          </View>
          <BadgeButton
            alignSelf="center"
            color={colors.primary}
            title="구매하기"
          />
        </View>

        <Text size={10} color={colors.darkGrey} mt={7}>
          누가 나에게 투표했는지 피넛으로 살짝 알아보세요.{'\n'}이 기회에 그
          친구와 더 가까워질 수도 있으니까!
        </Text>
      </View>

      <Divider mt={16} ml={13} />

      <View style={styles.listItem}>
        <View>
          <Text color={colors.darkGrey} size={12}>
            feanut ID
          </Text>
          <Text mt={7}>hi@feanut.com</Text>
        </View>
      </View>

      <View style={styles.listItem}>
        <View>
          <Text color={colors.darkGrey} size={12}>
            인스타그램
          </Text>
          <Text mt={7}>@feanut_official</Text>
        </View>
        <Switch />
      </View>

      <Divider ml={13} />

      <TouchableOpacity>
        <View style={styles.listItem}>
          <Text>feanut 서비스 소개</Text>
          <WithLocalSvg width={12} height={12} asset={svgs.right} />
        </View>
      </TouchableOpacity>

      <Divider ml={13} />

      <Text color={colors.darkGrey} size={12} ml={13} mt={27}>
        약관
      </Text>

      <Divider mt={8} ml={13} />

      <TouchableOpacity>
        <View style={[styles.listItem, {paddingVertical: 15}]}>
          <Text>개인정보 처리방침</Text>
          <WithLocalSvg width={12} height={12} asset={svgs.right} />
        </View>
      </TouchableOpacity>

      <Divider ml={13} />

      <TouchableOpacity>
        <View style={[styles.listItem, {paddingVertical: 15}]}>
          <Text>이용약관</Text>
          <WithLocalSvg width={12} height={12} asset={svgs.right} />
        </View>
      </TouchableOpacity>
      <Divider ml={13} />

      <Text color={colors.darkGrey} size={12} ml={13} mt={27}>
        푸시알림 설정
      </Text>

      <Divider mt={8} ml={13} />

      <View style={styles.listItem}>
        <Text>투표 수신알림</Text>
        <Switch />
      </View>

      <Divider ml={13} />

      <View style={styles.listItem}>
        <Text>투표 시작알림</Text>
        <Switch />
      </View>
      <Divider ml={13} />

      <Button title="로그아웃" mt={27} color={colors.lightGrey} />

      <View style={styles.withdrawal}>
        <Text color={colors.darkGrey} size={10}>
          앱버전 v1.01.2
        </Text>
      </View>

      <View style={[styles.withdrawal, {marginBottom: insets.bottom}]}>
        <TextButton title="회원탈퇴" color={colors.darkGrey} />
      </View>
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

  feanut: {marginTop: 20, paddingLeft: 13},
  feanutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 13,
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  withdrawal: {alignSelf: 'center', marginTop: 40},
});

export default ProfileTemplate;
