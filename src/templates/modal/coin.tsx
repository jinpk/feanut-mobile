import React from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CoinItem} from '../../components';
import {Text} from '../../components/text';
import {colors, svgs} from '../../libs/common';
import {CoinItem as CoinItemI} from '../../libs/interfaces';
import {WithLocalSvg} from 'react-native-svg';

type CoinModalTemplateProps = {
  data: CoinItemI[];
  visible: boolean;
  onClose: () => void;
  onPurchase: (productId: string) => void;
  loading: boolean;
};

export const CoinModalTemplate = (
  props: CoinModalTemplateProps,
): JSX.Element => {
  const insests = useSafeAreaInsets();
  const handleClose = () => {
    props.onClose();
  };

  return (
    <Modal
      animationType="slide"
      visible={props.visible}
      transparent
      onRequestClose={handleClose}>
      <View style={styles.root}>
        <View style={[styles.content, {paddingBottom: insests.bottom + 30}]}>
          <Text size={18} weight="bold" mb={23}>
            버터 구매
          </Text>
          <TouchableOpacity onPress={props.onClose} style={styles.close}>
            <WithLocalSvg
              color={colors.black}
              width={12}
              height={12}
              asset={svgs.close}
            />
          </TouchableOpacity>
          {props.data.map((x, i) => {
            return (
              <CoinItem
                key={i.toString()}
                onPurchase={() => {
                  props.onPurchase(x.productId);
                }}
                icon={x.icon}
                label={`${x.amount} 버터`}
                price={x.price}
              />
            );
          })}
        </View>
        {props.loading && (
          <View style={styles.purchaseRoot}>
            <ActivityIndicator color={colors.white} size="large" />
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.dark + '3D',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: colors.white,
    borderTopRightRadius: 12,
    padding: 30,
    borderTopLeftRadius: 12,
  },
  close: {
    position: 'absolute',
    backgroundColor: colors.lightGrey,
    right: 15,
    borderRadius: 100,
    padding: 12,
    top: 15,
  },
  purchaseRoot: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark + '80',
  },
});
