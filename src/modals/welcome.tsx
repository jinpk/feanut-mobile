import React from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import {PollCards} from '../components/poll-cards';
import {TextMarker, Text} from '../components/text';
import {CasualTopBar} from '../components/top-bar';
import {gifs} from '../libs/images';
import {useModalStore} from '../store';
import FriendSyncTemplate from '../templates/friend-sync';

function WelcomeModal(): JSX.Element {
  const visible = useModalStore(s => s.welcome);
  const close = useModalStore(s => s.actions.closeWelcome);

  const handleClose = () => {
    close();
  };

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={handleClose}>
      <CasualTopBar onClose={handleClose} />
      <FriendSyncTemplate
        icon={gifs.partyingFace}
        title="피넛터가 되신 걸 축하합니다!">
        <PollCards mt={30} />

        <Text align="center">
          피넛은 친구들과 다양한 주제로{'\n'}서로 투표하고 칭찬하는
        </Text>

        <View style={styles.markerWrap}>
          <TextMarker>
            <Text weight="bold">소셜 투표 서비스</Text>
          </TextMarker>
          <Text> 입니다!</Text>
        </View>

        <Text mb={30} align="center">
          지금 투표를 진행 할 친구 목록을 불러올까요?
        </Text>
      </FriendSyncTemplate>
    </Modal>
  );
}

const styles = StyleSheet.create({
  markerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default WelcomeModal;
