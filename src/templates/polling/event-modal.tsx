import {useEffect, useMemo} from 'react';
import {Modal, StatusBar} from 'react-native';
import {Information} from '../../components';
import {Text} from '../../components/text';
import {useCoin} from '../../hooks';
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
    </Modal>
  );
}

export default EventModalTemplate;
