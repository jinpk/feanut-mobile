import {StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Text} from './text';
import {colors} from '../libs/common';

type SchoolItemProps = {
  name: string;
  address: string;
  join: number | string;
  onPress: () => void;
};

export const SchoolItem = (props: SchoolItemProps) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.root}>
      <View>
        <Text>{props.name}</Text>
        <Text color={colors.darkGrey} mt={1} size={12}>
          {props.address}
        </Text>
      </View>

      <View style={styles.length}>
        <Text size={16} weight="medium">
          {props.join || '0'}
        </Text>
        <Text size={10} mt={1} color={colors.darkGrey}>
          가입수
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingVertical: 11,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.mediumGrey,
    marginHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  length: {
    alignItems: 'flex-end',
  },
});
