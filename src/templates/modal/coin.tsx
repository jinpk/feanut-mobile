import React from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CoinItem, Close} from '../../components';
import {Text} from '../../components/text';
import {colors} from '../../libs/common';
import {CoinItem as CoinItemI} from '../../libs/interfaces';

type CoinModalTemplateProps = {
  data: CoinItemI[];
  visible: boolean;
  onClose: () => void;
  onPurchase: (productId: string) => void;
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
            피넛코인 가게
          </Text>
          <Close onClose={handleClose} style={styles.close} />
          {props.data.map((x, i) => {
            return (
              <CoinItem
                key={i.toString()}
                onPurchase={() => {
                  props.onPurchase(x.productId);
                }}
                icon={x.icon}
                label={`${x.amount}개`}
                price={x.price}
              />
            );
          })}
        </View>
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
    right: 15,
    top: 15,
  },
});
