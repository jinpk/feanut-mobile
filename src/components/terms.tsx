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
      <TextButton onPress={props.onPrivacyTerm} title="개인정보 처리방침" />
      <Text size={12}>과 </Text>
      <TextButton onPress={props.onServiceTerm} title="서비스 이용약관" />
      <Text size={12}>에 동의합니다.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  terms: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Terms;
