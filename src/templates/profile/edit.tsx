import React from 'react';
import {Controller, UseFormReturn} from 'react-hook-form';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Avatar} from '../../components';
import {LineInput} from '../../components/input';
import {Text} from '../../components/text';
import {BackTopBar} from '../../components/top-bar';
import {colors, constants} from '../../libs/common';
import {Profile, ProfileForm} from '../../libs/interfaces';

type ProfileEditTemplateProps = {
  onBack: () => void;
  onComplete: () => void;
  onProfileImage: () => void;

  profile: Profile;

  form: UseFormReturn<ProfileForm>;
};

function ProfileEditTemplate(props: ProfileEditTemplateProps): JSX.Element {
  const disabled = !props.form.watch().name;
  const profileImage = props.form.watch().profileImage;

  return (
    <View style={styles.root}>
      <BackTopBar
        title="프로필 편집"
        rightComponent={
          <TouchableOpacity
            disabled={disabled}
            onPress={props.onComplete}
            style={[styles.complete]}>
            <Text color={disabled ? colors.darkGrey : colors.blue}>완료</Text>
          </TouchableOpacity>
        }
      />
      <View style={styles.profile}>
        <TouchableOpacity
          onPress={props.onProfileImage}
          style={styles.profileEdit}>
          <Avatar
            source={profileImage}
            size={100}
            defaultLogo={props.profile.gender === 'male' ? 'm' : 'w'}
          />
          <Text color={colors.blue} size={12} mt={7}>
            사진 변경
          </Text>
        </TouchableOpacity>

        <View style={styles.profileContent}>
          <Text color={colors.darkGrey} size={12} mt={7} ml={7} mb={6}>
            이름
          </Text>

          <Controller
            control={props.form.control}
            render={({field: {onChange, onBlur, value}}) => (
              <LineInput
                value={value}
                onChange={t => {
                  onChange(t.trim());
                  props.form.clearErrors('name');
                }}
                maxLength={constants.nameMaxLength}
                onBlur={() => {
                  onBlur();
                }}
              />
            )}
            name="name"
          />

          <Text color={colors.darkGrey} size={10} mt={7} ml={7}>
            친구가 투표할 때 보게 될 이름이예요
          </Text>
        </View>
      </View>

      <View style={styles.form}>
        <Text color={colors.darkGrey} ml={7} size={12} mb={6}>
          상태 메시지
        </Text>

        <Controller
          control={props.form.control}
          render={({field: {onChange, onBlur, value}}) => (
            <LineInput
              value={value}
              onChange={t => {
                onChange(t);
                props.form.clearErrors('statusMessage');
              }}
              maxLength={constants.statusMessageMaxLength}
              onBlur={() => {
                onChange(value.trim());
                onBlur();
              }}
              placeholder="친구가 보게 될 메시지에요"
            />
          )}
          name="statusMessage"
        />
      </View>

      <View style={[styles.form, styles.formRow]}>
        <View style={styles.formContent}>
          <Text color={colors.darkGrey} size={12} mb={6}>
            성별
          </Text>
          <Text>{props.profile.gender === 'male' ? '남자' : '여자'}</Text>
        </View>
        {/**
        <View style={styles.formContent}>
          <Text color={colors.darkGrey} size={12} mb={6}>
            생년월일
          </Text>
          <Text>{dayjs(props.profile.birth).format('YYYY년 MM월 DD일')}</Text>
        </View>
         */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  profileEdit: {
    alignItems: 'center',
    marginRight: 12,
  },
  complete: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  profileContent: {
    flex: 1,
  },
  form: {
    marginTop: 30,
    paddingLeft: 23,
    paddingRight: 16,
  },
  formRow: {
    flexDirection: 'row',
  },
  formContent: {
    flex: 1,
  },
});

export default ProfileEditTemplate;
