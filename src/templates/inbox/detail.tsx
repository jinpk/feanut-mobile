import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Pull} from '../../components/poll';
import {BackTopBar} from '../../components/top-bar';
import {colors} from '../../libs/common';
import {PollingReceiveDetail} from '../../libs/interfaces/polling';
import {Profile} from '../../libs/interfaces';

type InboxDetailTemplateProps = {
  pull?: PollingReceiveDetail;
  myProfile: Profile;

  onBack: () => void;
  onOpen: () => void;
  onShare: () => void;
};

function InboxDetailTemplate(props: InboxDetailTemplateProps) {
  return (
    <View style={styles.root}>
      {props.pull && (
        <Pull
          myProfile={props.myProfile}
          {...props.pull}
          onOpen={props.onOpen}
          onShare={props.onShare}
        />
      )}
      <BackTopBar absolute={Boolean(props.pull)} onBack={props.onBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.white},
});

export default InboxDetailTemplate;
