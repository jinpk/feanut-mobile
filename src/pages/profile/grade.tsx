import React, {useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import {View} from 'react-native';
import {colors, constants, routes} from '../../libs/common';
import {BackTopBar} from '../../components/top-bar';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Text} from '../../components/text';
import {School} from '../../libs/interfaces/school';
import {Button} from '../../components/button';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {LargeInput} from '../../components/input';

type ProfileEditGradeProps = RouteProp<
  {ProfileEditGrade: {school: School}},
  'ProfileEditGrade'
>;

export default function ProfileEditGrade() {
  const gradeRef = useRef<TextInput>(null);
  const roomRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {params} = useRoute<ProfileEditGradeProps>();
  const [grade, setGrade] = useState<string>('');
  const [room, setRoom] = useState<string>('');

  const handleConfirm = () => {
    if (!grade) return;
    if (!room) return;

    navigation.navigate(routes.profileEdit, {
      updateSchool: {
        grade: parseInt(grade),
        room: parseInt(room),
        school: params.school,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, {paddingBottom: insets.bottom}]}
      {...(constants.platform === 'ios' ? {behavior: 'padding'} : {})}>
      <View style={[styles.root]}>
        <BackTopBar onBack={navigation.goBack} />
        <Text weight="bold" size={18} mt={15} mx={16}>
          {params.school.name}
        </Text>

        <Text mt={30} mx={16}>
          학년과 반을 입력해 주세요.
        </Text>

        <View style={styles.inputWrap}>
          <TouchableWithoutFeedback
            onPress={() => {
              gradeRef.current?.focus();
            }}>
            <View style={styles.row}>
              <LargeInput
                inputRef={gradeRef}
                keyboardType="number-pad"
                placeholder="0"
                maxLength={1}
                value={grade}
                onChange={grade => {
                  setGrade(grade);
                  if (grade) {
                    roomRef.current?.focus();
                  }
                }}
              />
              <Text ml={8} weight="bold" color={colors.darkGrey} size={27}>
                학년
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              roomRef.current?.focus();
            }}>
            <View style={styles.row}>
              <LargeInput
                keyboardType="number-pad"
                inputRef={roomRef}
                placeholder="0"
                maxLength={2}
                value={room}
                onChange={room => {
                  setRoom(room);
                  if (!room) {
                    gradeRef.current?.focus();
                  }
                }}
              />
              <Text ml={8} weight="bold" color={colors.darkGrey} size={27}>
                반
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={{flex: 1}} />
        <Button
          disabled={!grade || !room}
          onPress={handleConfirm}
          title={'확인'}
          mx={16}
          mb={15}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.white},
  inputWrap: {
    marginTop: 14,
    marginRight: 16,
    marginLeft: 3.5,
    flexDirection: 'row',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12.5,
  },
});
