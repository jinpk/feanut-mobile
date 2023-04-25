import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {Button} from '../components/button';
import {TextButton} from '../components/button/text-button';
import {Divider} from '../components';
import {Text} from '../components/text';
import Switch from '../components/switch';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, svgs} from '../libs/common';
import DeviceInfo from 'react-native-device-info';
import {formatPhoneNumber} from '../libs/common/utils';
import {BackTopBar} from '../components/top-bar';

type SettingTemplateProps = {
  onBack: () => void;

  phoneNumber: string;

  onLogout: () => void;
  onWithdrawal: () => void;

  onService: () => void;
  onTerms: () => void;
  onPrivacy: () => void;

  receivePoll: boolean;
  receivePull: boolean;
  onReceivePull: (value: boolean) => void;
  onReceivePoll: (value: boolean) => void;
};

function SettingTemplate(props: SettingTemplateProps): JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <BackTopBar title="설정" onBack={props.onBack} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.listItem}>
          <View>
            <Text color={colors.darkGrey} size={12}>
              내 전화번호
            </Text>
            <Text mt={7}>{formatPhoneNumber(props.phoneNumber)}</Text>
          </View>
        </View>
        {/**<View style={styles.listAccountItem}>
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
      </View> */}

        <Divider />

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

        <Divider />

        <Text color={colors.darkGrey} size={12} mt={27}>
          약관
        </Text>

        <Divider mt={8} />

        <TouchableOpacity onPress={props.onPrivacy}>
          <View style={[styles.listItem, {paddingVertical: 15}]}>
            <Text>개인정보 처리방침</Text>
          </View>
        </TouchableOpacity>

        <Divider />

        <TouchableOpacity onPress={props.onTerms}>
          <View style={[styles.listItem, {paddingVertical: 15}]}>
            <Text>이용약관</Text>
          </View>
        </TouchableOpacity>
        <Divider />

        <Text color={colors.darkGrey} size={12} mt={27}>
          푸시알림 설정
        </Text>

        <Divider mt={8} />

        <View style={styles.listItem}>
          <Text>투표 수신알림</Text>
          <Switch value={props.receivePull} onChange={props.onReceivePull} />
        </View>

        <Divider />

        <View style={styles.listItem}>
          <Text>투표 시작알림</Text>
          <Switch value={props.receivePoll} onChange={props.onReceivePoll} />
        </View>
        <Divider />

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
          <Text
            color={colors.darkGrey}
            mt={20}
            size={10}
            mb={insets.bottom + 60}>
            앱버전 v{DeviceInfo.getVersion()}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    paddingHorizontal: 29,
  },
  profile: {
    marginTop: 10,
    flexDirection: 'row',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  listAccountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
  withdrawal: {alignSelf: 'center', marginTop: 40},
});

export default SettingTemplate;
