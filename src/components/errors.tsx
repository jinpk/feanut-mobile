import {StyleSheet, View} from 'react-native';
import {Text} from './text';
import {colors} from '../libs/common';

type ErrorsProps = {
  errors: string[];
  mx?: number;
  mt?: number;
};

export const Errors = (props: ErrorsProps): JSX.Element | null => {
  if (!props.errors.filter(x => x).length) {
    return null;
  }
  return (
    <View
      style={[
        styles.root,
        {
          marginTop: props.mt || 7,
          marginHorizontal: props.mx,
        },
      ]}>
      {props.errors.map((x, i) => {
        if (!x) {
          return null;
        }
        return (
          <View
            style={[
              styles.errorWrap,
              props.errors.length === i - 1 && styles.errorWrapLast,
            ]}
            key={i.toString()}>
            <View style={styles.warning}>
              <Text size={12} color={colors.red}>
                {'!'}
              </Text>
            </View>
            <Text color={colors.red} size={12}>
              {x}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
  },
  errorWrap: {
    marginBottom: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorWrapLast: {
    marginBottom: 0,
  },
  warning: {
    borderRadius: 100,
    width: 16,
    marginRight: 7,
    height: 16,
    borderWidth: 1,
    borderColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
