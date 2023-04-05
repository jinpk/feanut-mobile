import React from 'react';
import {GestureResponderEvent, StyleSheet, View} from 'react-native';
import {TextButton} from '../components/button/text-button';
import {Text} from '../components/text';

type TermsProps = {
  onPrivacyTerm: (e: GestureResponderEvent) => void;
  onServiceTerm: (e: GestureResponderEvent) => void;
};

export const Terms = (props: TermsProps): JSX.Element => {
  return (
    <View style={styles.terms}>
      <View style={styles.term}>
        <Text size={12}>계속 진행하시면 feanut의 </Text>
        <TextButton onPress={props.onServiceTerm} title="서비스 이용약관" />
        <Text size={12}>과 </Text>
      </View>
      <View style={styles.term}>
        <TextButton onPress={props.onPrivacyTerm} title="개인정보 처리방침" />
        <Text size={12}>에 동의하는 것 입니다.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  terms: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  term: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Terms;
