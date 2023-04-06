import React from 'react';
import {GestureResponderEvent, StyleSheet, View} from 'react-native';
import {TextButton} from '../components/button/text-button';
import {Text} from '../components/text';
import {colors} from '../libs/common';

type TermsProps = {
  onPrivacyTerm: (e: GestureResponderEvent) => void;
  onServiceTerm: (e: GestureResponderEvent) => void;
};

export const Terms = (props: TermsProps): JSX.Element => {
  return (
    <View style={styles.terms}>
      <View style={styles.term}>
        <Text size={12} color={colors.darkGrey}>
          시작하면 feanut{' '}
        </Text>
        <TextButton onPress={props.onServiceTerm} title="이용약관" />
        <Text size={12} color={colors.darkGrey}>
          과{' '}
        </Text>
      </View>
      <View style={styles.term}>
        <TextButton onPress={props.onPrivacyTerm} title="개인정보 처리방침" />
        <Text size={12} color={colors.darkGrey}>
          에 동의하는 것으로 간주됩니다.
        </Text>
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
