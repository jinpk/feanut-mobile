import {useEffect} from 'react';
import {useModalStore, useUserStore} from '../libs/stores';
import {getLegacyFriendship} from '../libs/api/friendship';

export function useLegacyFriendship() {
  const logged = useUserStore(s => s.logged);
  const userId = useUserStore(s => s.user?.id);
  const openLegacyFriendship = useModalStore(
    s => s.actions.openLegacyFriendship,
  );

  useEffect(() => {
    if (logged && userId) {
      getLegacyFriendship(userId).then(isLegacy => {
        if (isLegacy) {
          openLegacyFriendship();
        }
      });
    }
  }, [logged, userId]);
}
