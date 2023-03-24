import React from 'react';
import {LineIndicator} from '../../components';
import {usePollingStore} from '../../libs/stores';

export const PollingIndicatorFeautre = React.memo(() => {
  const pollsLength = usePollingStore(s => s.polls.length);
  const currentPollIndex = usePollingStore(s => s.pollIndex);

  return <LineIndicator length={pollsLength} index={currentPollIndex} />;
});
