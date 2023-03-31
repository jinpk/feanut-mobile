import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {useInbox} from '../hooks';
import InboxTemplate from '../templates/inbox';

function Inbox(): JSX.Element {
  const navigation = useNavigation();
  const inbox = useInbox();

  return (
    <InboxTemplate
      data={inbox.pulls}
      onBack={navigation.goBack}
      onItemPress={() => {}}
      onLoadMore={inbox.nextPage}
      loading={inbox.loading}
      onRefresh={inbox.refresh}
    />
  );
}

export default Inbox;
