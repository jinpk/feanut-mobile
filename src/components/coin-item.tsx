import {Image, StyleSheet, View} from 'react-native';
import {colors} from '../libs/common';
import {BadgeButton} from './button';
import {Text} from './text';

type CoinItemProps = {
  icon: number;
  label: string;
  price: string;

  onPurchase: () => void;
};

export const CoinItem = (props: CoinItemProps) => {
  return (
    <View style={styles.root}>
      <View style={styles.iconWrap}>
        <Image source={props.icon} style={styles.icon} />
      </View>
      <View style={styles.content}>
        <Text weight="medium">{props.label}</Text>
        <BadgeButton
          color={colors.primary}
          alignSelf="center"
          onPress={props.onPurchase}
          title={props.price}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
  },
  iconWrap: {
    borderRadius: 100,
    backgroundColor: colors.lightGrey,
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {},
  content: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginLeft: 30,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumGrey,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
