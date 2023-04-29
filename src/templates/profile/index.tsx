import React from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
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
import {formatPhoneNumber} from '../../libs/common/utils';
import {BackTopBar} from '../../components/top-bar';
import {FeanutCoin} from '../../components/feanut-coin';

type ProfileTemplateProps = {
  onBack: () => void;

  phoneNumber: string;
  profile: Profile;
  friendsCount: number;
  feanutAmount: number;
  onLogout: () => void;
  onPurchaseFeanut: () => void;
  onEditProfile: () => void;
  onWithdrawal: () => void;
  // onInstagram: (value: boolean) => void;

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

  onProfileImage: () => void;

  onSetting: () => void;
};

function ProfileTemplate(props: ProfileTemplateProps): JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <BackTopBar
        title="프로필"
        onBack={props.onBack}
        rightComponent={
          <TextButton
            fontSize={14}
            title="설정"
            hiddenBorder
            onPress={props.onSetting}
            style={styles.setting}
          />
        }
      />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.pageTopPadding} />
        <FeanutCoin onPress={props.onPurchaseFeanut} />
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
    paddingHorizontal: 16,
  },
  setting: {padding: 8, margin: 8},
  pageTopPadding: {
    marginTop: 15,
  },
});

export default ProfileTemplate;
