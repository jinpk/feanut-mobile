import React, {useState} from 'react';
import {Alert, StyleSheet} from 'react-native';
import {View} from 'react-native';
import {colors, constants, routes} from '../../libs/common';
import {BackTopBar} from '../../components/top-bar';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Text} from '../../components/text';
import {School} from '../../libs/interfaces/school';
import {TouchableOpacity} from 'react-native';
import {Button} from '../../components/button';
import {useSignUp} from '../../hooks/use-signup';
import {postUpdateMySchool} from '../../libs/api/school';

type ProfileEditGradeProps = RouteProp<
  {ProfileEditGrade: {school: School}},
  'ProfileEditGrade'
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

export default function ProfileEditGrade() {
  const navigation = useNavigation();
  const {params} = useRoute<ProfileEditGradeProps>();
  const [grade, setGrade] = useState<number | undefined>();

  const handleConfirm = () => {
    if (!grade) return;

    postUpdateMySchool({grade: grade, code: params.school.code})
      .then(() => {
        navigation.navigate(routes.profileEdit);
      })
      .catch((err: any) => {
        Alert.alert(err.message || err);
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
        title={'확인'}
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
