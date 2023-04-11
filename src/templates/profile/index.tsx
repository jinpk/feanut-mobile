import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {Avatar} from '../../components/avatar';
import {BadgeButton, Button} from '../../components/button';
import {TextButton} from '../../components/button/text-button';
import {Divider} from '../../components';
import {Text} from '../../components/text';
import Switch from '../../components/switch';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, svgs} from '../../libs/common';
import {Profile} from '../../libs/interfaces';
import DeviceInfo from 'react-native-device-info';
import {getObjectURLByKey} from '../../libs/common/file';

type ProfileTemplateProps = {
  profile: Profile;
  friendsCount: number;
  feanutAmount: number;
  onLogout: () => void;
  onPurchaseFeanut: () => void;
  onEditProfile: () => void;
  onWithdrawal: () => void;
  onInstagram: (value: boolean) => void;

  onService: () => void;
  onTerms: () => void;
  onPrivacy: () => void;

  // notifications
  receivePoll: boolean;
  receivePull: boolean;

  onReceivePull: (value: boolean) => void;
  onReceivePoll: (value: boolean) => void;

  onFriend: () => void;
  onCard: () => void;
};

function ProfileTemplate(props: ProfileTemplateProps): JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.profile}>
        <Avatar
          size={100}
          defaultLogo={props.profile.gender === 'male' ? 'm' : 'w'}
          uri={getObjectURLByKey(props.profile.profileImageKey, '150')}
        />

        <View style={styles.profileContent}>
          <View style={styles.profileContentButton}>
            <Text color={colors.darkGrey} size={12}>
              이름
            </Text>
            <Text my={7}>{props.profile.name}</Text>
            <TextButton
              onPress={props.onCard}
              hiddenBorder
              title="내 피넛카드"
              rightIcon={
                <WithLocalSvg
                  color={colors.blue}
                  width={4.5}
                  height={9}
                  asset={svgs.right}
                />
              }
            />
          </View>

          <View style={styles.profileContentButton}>
            <Text color={colors.darkGrey} size={12}>
              친구
            </Text>
            <Text my={7}>{props.friendsCount || 0}</Text>
            <TextButton
              onPress={props.onFriend}
              hiddenBorder
              title="친구 관리"
              rightIcon={
                <WithLocalSvg
                  color={colors.blue}
                  width={4.5}
                  height={9}
                  asset={svgs.right}
                />
              }
            />
          </View>
        </View>
      </View>

      <Button
        onPress={props.onEditProfile}
        color={colors.lightGrey}
        title="프로필 편집"
        mt={15}
        fontColor={colors.dark}
      />

      <View style={styles.feanut}>
        <View style={styles.feanutContent}>
          <View>
            <Text color={colors.darkGrey} size={12}>
              보유 피넛
            </Text>
            <Text mt={7}>{props.feanutAmount}</Text>
          </View>
          <BadgeButton
            onPress={props.onPurchaseFeanut}
            alignSelf="center"
            color={colors.primary}
            title="충전하기"
          />
        </View>

        <Text size={10} color={colors.darkGrey} mt={7}>
          누가 나에게 투표했는지 피넛으로 살짝 알아보세요.{'\n'}이 기회에 그
          친구와 더 가까워질 수도 있으니까!
        </Text>
      </View>

      <Divider mt={16} mx={13} mb={15} />
      {/**
        <View style={styles.listItem}>
        <View>
          <Text color={colors.darkGrey} size={12}>
            내 전화번호
          </Text>
          <Text mt={7}>01021883985</Text>
        </View>
      </View>
       */}

      <View style={styles.listAccountItem}>
        <View>
          <Text color={colors.darkGrey} size={12}>
            인스타그램 계정
          </Text>
          {Boolean(props.profile.instagram) && (
            <Text mt={7}>@{props.profile.instagram}</Text>
          )}
          {!props.profile.instagram && (
            <Text mt={7} color={colors.darkGrey}>
              연결되지 않음
            </Text>
          )}
        </View>
        <Switch
          value={Boolean(props.profile.instagram)}
          onChange={props.onInstagram}
        />
      </View>

      <Divider mx={13} />

      <TouchableOpacity onPress={props.onService}>
        <View style={styles.listItem}>
          <Text>feanut 서비스 소개</Text>
          <WithLocalSvg
            width={12}
            height={12}
            asset={svgs.right}
            color={colors.darkGrey}
          />
        </View>
      </TouchableOpacity>

      <Divider mx={13} />

      <Text color={colors.darkGrey} size={12} ml={13} mt={27}>
        약관
      </Text>

      <Divider mt={8} mx={13} />

      <TouchableOpacity onPress={props.onPrivacy}>
        <View style={[styles.listItem, {paddingVertical: 15}]}>
          <Text>개인정보 처리방침</Text>
        </View>
      </TouchableOpacity>

      <Divider mx={13} />

      <TouchableOpacity onPress={props.onTerms}>
        <View style={[styles.listItem, {paddingVertical: 15}]}>
          <Text>이용약관</Text>
        </View>
      </TouchableOpacity>
      <Divider mx={13} />

      <Text color={colors.darkGrey} size={12} ml={13} mt={27}>
        푸시알림 설정
      </Text>

      <Divider mt={8} mx={13} />

      <View style={styles.listItem}>
        <Text>투표 수신알림</Text>
        <Switch value={props.receivePull} onChange={props.onReceivePull} />
      </View>

      <Divider mx={13} />

      <View style={styles.listItem}>
        <Text>투표 시작알림</Text>
        <Switch value={props.receivePoll} onChange={props.onReceivePoll} />
      </View>
      <Divider mx={13} />

      <Button
        onPress={props.onLogout}
        title="로그아웃"
        mt={30}
        color={colors.lightGrey}
      />

      <View style={[styles.withdrawal]}>
        <TextButton
          onPress={props.onWithdrawal}
          title="회원탈퇴"
          color={colors.darkGrey}
        />
      </View>

      <View style={styles.withdrawal}>
        <Text color={colors.darkGrey} mt={20} size={10} mb={insets.bottom + 60}>
          앱버전 v{DeviceInfo.getVersion()}
        </Text>
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
    paddingHorizontal: 13,
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  listAccountItem: {
    flexDirection: 'row',
    paddingHorizontal: 13,
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
  withdrawal: {alignSelf: 'center', marginTop: 40},
});

export default ProfileTemplate;
