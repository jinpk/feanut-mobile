import React, {useEffect, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import {View} from 'react-native';
import {colors, constants} from '../../libs/common';
import {BackTopBar} from '../../components/top-bar';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Text} from '../../components/text';
import {SignUpRequest} from '../../libs/interfaces';
import {School} from '../../libs/interfaces/school';
import {Button} from '../../components/button';
import {useSignUp} from '../../hooks/use-signup';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {LargeInput} from '../../components/input';

type SignUpGradeProps = RouteProp<
  {SignUpGrade: {payload: SignUpRequest; school: School}},
  'SignUpGrade'
>;

export default function SignUpGrade() {
  const gradeRef = useRef<TextInput>(null);
  const roomRef = useRef<TextInput>(null);

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const signUp = useSignUp();
  const {params} = useRoute<SignUpGradeProps>();
  const [grade, setGrade] = useState<string>('');
  const [room, setRoom] = useState<string>('');

  const [init, setInit] = useState(false);

  useEffect(() => {
    let tm = setTimeout(() => {
      gradeRef.current?.focus();
    }, 1000);
    return () => {
      clearTimeout(tm);
    };
  }, []);

  /** 대학교 바로 회원가입 처리 */
  useEffect(() => {
    if (params.school.level === '대학교') {
      signUp({
        ...params.payload,
        school: {
          code: params.school.code,
        },
      });
    } else {
      setInit(true);
    }
  }, []);

  const handleConfirm = () => {
    if (!grade) return;
    if (!room) return;

    signUp({
      ...params.payload,
      school: {
        code: params.school.code,
        grade: parseInt(grade),
        room: parseInt(room),
      },
    });
  };

  if (!init) {
    return (
      <View style={[styles.root]}>
        <BackTopBar onBack={navigation.goBack} />
        <Text weight="bold" size={18} mt={15} mx={16}>
          {params.school.name}
        </Text>
      </View>
    );
  }

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
                autoFocus
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
          title={'가입하기'}
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
