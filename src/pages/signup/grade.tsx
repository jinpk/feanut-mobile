import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {View} from 'react-native';
import {colors, constants} from '../../libs/common';
import {BackTopBar} from '../../components/top-bar';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Text} from '../../components/text';
import {SignUpRequest} from '../../libs/interfaces';
import {School} from '../../libs/interfaces/school';
import {TouchableOpacity} from 'react-native';
import {Button} from '../../components/button';
import {useSignUp} from '../../hooks/use-signup';

type SignUpGradeProps = RouteProp<
  {SignUpGrade: {payload: SignUpRequest; school: School}},
  'SignUpGrade'
>;

const grades = [
  {
    label: '1학년',
    value: 1,
  },
  {
    label: '2학년',
    value: 2,
  },
  {
    label: '3학년',
    value: 3,
  },
];

export default function SignUpGrade() {
  const navigation = useNavigation();
  const signUp = useSignUp();
  const {params} = useRoute<SignUpGradeProps>();
  const [grade, setGrade] = useState<number | undefined>();

  const handleConfirm = () => {
    if (!grade) return;

    signUp({
      ...params.payload,
      school: {
        code: params.school.code,
        grade,
      },
    });
  };

  return (
    <View style={styles.root}>
      <BackTopBar onBack={navigation.goBack} />
      <Text weight="bold" size={18} mt={15} mx={16}>
        {params.school.name} 몇 학년 이신가요?
      </Text>

      <Text mt={30} mx={16}>
        학년을 선택해 주세요
      </Text>

      <View style={styles.grades}>
        {grades.map((x, i) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setGrade(x.value);
              }}
              key={i.toString()}
              style={styles.grade}>
              <Text
                size={27}
                weight="medium"
                color={grade === x.value ? colors.dark : colors.mediumGrey}>
                {x.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{flex: 1}} />
      <Button
        disabled={!grade}
        onPress={handleConfirm}
        title={'가입하기'}
        mx={16}
        mb={15}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.white},
  grades: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 16,
  },
  grade: {
    width: (constants.screenWidth - 32) / 3,
    paddingVertical: 16,
  },
});
