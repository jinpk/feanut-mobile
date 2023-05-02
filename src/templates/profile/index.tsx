import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Avatar} from '../../components/avatar';
import {TextButton} from '../../components/button/text-button';
import {Text} from '../../components/text';
import {colors, constants, emotions, pngs, svgs} from '../../libs/common';
import {Profile} from '../../libs/interfaces';
import {getObjectURLByKey} from '../../libs/common/file';
import {BackTopBar} from '../../components/top-bar';
import {FeanutCoin} from '../../components/feanut-coin';
import {
  formatLengthLabel,
  objectToArrWithSorting,
} from '../../libs/common/utils';
import {WithLocalSvg} from 'react-native-svg';
import {FeanutCard} from '../../libs/interfaces/polling';
import {FeanutCardItem} from '../../components/feanut-card';

type ProfileTemplateProps = {
  onBack: () => void;

  phoneNumber: string;
  profile: Profile;
  onPurchaseFeanut: () => void;

  onFriend: () => void;

  onProfileImage: () => void;

  onSetting: () => void;

  onFeautCardTooltip: () => void;
  onFeautCard: () => void;

  onEditProfile: () => void;

  me: boolean;

  friendsCount: number;
  pollsCount: number;
  pullsCount: number;

  coinAmount: number;

  feanutCard?: FeanutCard;

  contactName: string;
};

function ProfileTemplate(props: ProfileTemplateProps): JSX.Element {
  return (
    <View style={styles.root}>
      <BackTopBar
        title="프로필"
        onBack={props.onBack}
        rightComponent={
          props.me ? (
            <TextButton
              fontSize={14}
              title="설정"
              hiddenBorder
              onPress={props.onSetting}
              style={styles.setting}
            />
          ) : undefined
        }
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.pageTopPadding} />
        {props.me && (
          <FeanutCoin
            amount={props.coinAmount}
            onPress={props.onPurchaseFeanut}
          />
        )}

        <View style={styles.body}>
          <TouchableWithoutFeedback onPress={props.onProfileImage}>
            <View>
              <Avatar
                uri={getObjectURLByKey(props.profile.profileImageKey)}
                defaultLogo={
                  props.profile.gender === 'male'
                    ? 'm'
                    : props.profile.gender === 'female'
                    ? 'w'
                    : undefined
                }
                size={100}
              />
            </View>
          </TouchableWithoutFeedback>
          <Text mt={15} size={16} weight="medium">
            {props.profile.ownerId ? props.profile.name : props.contactName}
          </Text>
          {/*!props.me && Boolean(props.contactName) && (
            <Text mt={5} color={colors.darkGrey} size={10}>
              내 연락처에 저장된 이름 : {props.contactName}
            </Text>
          )*/}

          <Text my={30} mx={constants.screenWidth * 0.18} align="center">
            {props.profile.statusMessage}
          </Text>

          {props.me && (
            <TouchableOpacity style={styles.edit} onPress={props.onEditProfile}>
              <Image source={pngs.modify} style={styles.modify} />
              <Text ml={10} size={12} mr={27}>
                프로필 편집
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.statsContainer}>
            <TouchableOpacity
              disabled={!props.me}
              onPress={props.onFriend}
              style={styles.stats}>
              <Text size={16} weight="medium">
                {formatLengthLabel(props.friendsCount)}
              </Text>
              {props.me && (
                <View style={styles.myFriend}>
                  <Text size={12} mr={4} color={colors.darkGrey}>
                    친구
                  </Text>
                  <WithLocalSvg
                    asset={svgs.right}
                    width={5}
                    height={10}
                    color={colors.darkGrey}
                  />
                </View>
              )}
              {!props.me && (
                <Text size={12} mt={4} color={colors.darkGrey}>
                  친구
                </Text>
              )}
            </TouchableOpacity>
            <View style={styles.divider} />
            <View style={styles.stats}>
              <Text size={16} weight="medium">
                {formatLengthLabel(props.pollsCount)}
              </Text>
              <Text size={12} mt={4} color={colors.darkGrey}>
                투표 참여
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stats}>
              <Text size={16} weight="medium">
                {formatLengthLabel(props.pullsCount)}
              </Text>
              <Text size={12} mt={4} color={colors.darkGrey}>
                투표 수신
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.feanutCardToolBar,
              // 전체 보기 버튼에서 padding 설정
              {marginBottom: props.me ? 0 : 14, marginTop: props.me ? 21 : 35},
            ]}>
            <TouchableOpacity
              onPress={props.onFeautCardTooltip}
              style={styles.feanutCardTitleWrap}>
              <Text weight="bold" size={16}>
                피넛 카드
              </Text>
              <View style={styles.qm}>
                <Image source={pngs.q} style={styles.q} />
              </View>
            </TouchableOpacity>
            {props.me && (
              <TextButton
                style={styles.feanutCard}
                onPress={props.onFeautCard}
                hiddenBorder
                title="전체 보기"
              />
            )}
          </View>

          <ScrollView
            horizontal
            style={styles.feanutCards}
            showsHorizontalScrollIndicator={false}>
            {props.feanutCard &&
              objectToArrWithSorting(props.feanutCard).map((item, index) => {
                return (
                  <FeanutCardItem
                    mr={10}
                    ml={index === 0 ? 16 : 0}
                    width={(constants.screenWidth - 26) / 3}
                    key={index.toString()}
                    emotion={item.key as emotions}
                    value={item.value}
                  />
                );
              })}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  feanutCardToolBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    marginLeft: 16,
  },
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  setting: {padding: 8, margin: 8},
  pageTopPadding: {
    marginTop: 15,
  },
  body: {
    paddingTop: 30,
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stats: {
    alignItems: 'center',
    paddingHorizontal: 25,
    justifyContent: 'center',
  },
  divider: {
    backgroundColor: colors.mediumGrey,
    width: 1,
    height: 25,
  },
  myFriend: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
  feanutCards: {
    marginBottom: 130,
  },
  feanutCardTitleWrap: {flexDirection: 'row', alignItems: 'center'},
  qm: {
    width: 15,
    height: 15,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: colors.darkGrey,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  q: {
    width: 5.1,
    height: 8.7,
  },
  feanutCard: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  edit: {
    backgroundColor: colors.lightGrey,
    borderRadius: 20,
    marginBottom: 16,
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modify: {
    width: 24,
    height: 24,
    marginLeft: 24,
    resizeMode: 'contain',
  },
});

export default ProfileTemplate;
