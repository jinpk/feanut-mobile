import {useEffect, useMemo} from 'react';
import {Modal, StatusBar, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text} from '../../components/text';
import {useCoin} from '../../hooks';
import {colors} from '../../libs/common';
import {configs} from '../../libs/common/configs';
import {RoundEvent} from '../../libs/interfaces/polling';
import {useEmojiStore} from '../../libs/stores';

type EventModalTemplateProps = {
  onClose: () => void;
} & RoundEvent;

function EventModalTemplate(props: EventModalTemplateProps) {
  const emojis = useEmojiStore(s => s.emojis);
  const coin = useCoin();
  const emojiURI = useMemo(() => {
    const key = emojis.find(x => x.id === props.emojiId)?.key;
    if (key) {
      return configs.cdnBaseUrl + '/' + key;
    } else {
      return '';
    }
  }, [emojis]);
  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    let tm = setTimeout(() => {
      StatusBar.setBarStyle('light-content');
      props.onClose();
    }, 3000);
    return () => {
      clearTimeout(tm);
    };
  }, []);

  return (
    <Modal visible onRequestClose={props.onClose} animationType="fade">
      <View style={styles.root}>
        {Boolean(emojiURI) && (
          <FastImage
            source={{uri: emojiURI}}
            resizeMode={FastImage.resizeMode.contain}
            style={styles.icon}
          />
        )}
        <Text weight="bold" size={18} mt={15} align="center">
          {props.message}
        </Text>
        {Boolean(props.markingText) &&
          (() => {
            const markingStartIndex = props.subMessage.indexOf(
              props.markingText,
            );
            const markingEndIndex =
              markingStartIndex + props.markingText.length;
            return (
              <Text mt={29} align="center">
                <Text>{props.subMessage.substring(0, markingStartIndex)}</Text>
                <Text
                  style={{backgroundColor: colors.yellow + '99'}}
                  weight="bold">
                  {props.subMessage.substring(
                    markingStartIndex,
                    markingEndIndex,
                  )}
                </Text>
                <Text>
                  {props.subMessage.substring(
                    markingEndIndex,
                    props.subMessage.length,
                  )}
                </Text>
              </Text>
            );
          })()}
        {!Boolean(props.markingText) && (
          <Text size={14} mt={29} align="center">
            {props.subMessage}
          </Text>
        )}

        <Text size={14} mt={30} align="center">
          보유 피넛
        </Text>
        <Text weight="bold" size={27} mt={7} align="center">
          {coin.amount}
        </Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  icon: {
    width: 45,
    height: 45,
  },
});

export default EventModalTemplate;
