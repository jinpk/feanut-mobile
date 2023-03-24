import {StyleSheet, View} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {Text} from './text';
import {svgs, colors} from '../libs/common';

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
            {
              // <WithLocalSvg asset={svgs.warning} width={16} height={16} />
            }
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
    marginTop: 4,
  },
  errorWrap: {
    marginBottom: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorWrapLast: {
    marginBottom: 0,
  },
});
