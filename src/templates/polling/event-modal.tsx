import {useEffect, useMemo, useRef} from 'react';
import {Animated} from 'react-native';
import {Information} from '../../components';
import {Text} from '../../components/text';
import {useCoin} from '../../hooks';
import {configs} from '../../libs/common/configs';
import {RoundEvent} from '../../libs/interfaces/polling';
import {useEmojiStore} from '../../libs/stores';
import {StyleSheet} from 'react-native';
import {colors} from '../../libs/common';

type EventModalTemplateProps = {
  onClose: () => void;
} & RoundEvent;

function EventModalTemplate(props: EventModalTemplateProps) {
  const emojis = useEmojiStore(s => s.emojis);
  const coin = useCoin();

  const opacity = useRef(new Animated.Value(0)).current;

  const emojiURI = useMemo(() => {
    const key = emojis.find(x => x.id === props.emojiId)?.key;
    if (key) {
      return configs.cdnBaseUrl + '/' + key;
    } else {
      return '';
    }
  }, [emojis]);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start(result => {
      if (!result.finished) {
        opacity.setValue(1);
      }
      let tm = setTimeout(() => {
        clearTimeout(tm);
        // hide
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start(result => {
          if (!result.finished) {
            opacity.setValue(0);
          }
          props.onClose();
        });
      }, 4000);
    });
  }, []);

  return (
    <Animated.View style={[styles.root, {opacity}]}>
      <Information
        icon={{uri: emojiURI}}
        message={props.message}
        subMessage={props.subMessage}
        markingText={props.markingText}>
        <Text size={14} mt={30} align="center">
          보유 피넛
        </Text>
        <Text weight="bold" size={27} mt={7} align="center">
          {coin.amount}
        </Text>
      </Information>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    backgroundColor: colors.white,
    zIndex: 10,
    right: 0,
    bottom: 0,
    left: 0,
  },
});

export default EventModalTemplate;
