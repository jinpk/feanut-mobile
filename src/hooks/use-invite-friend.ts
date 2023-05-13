import {useCallback, useRef} from 'react';
import {useUserStore} from '../libs/stores';
import {getMyReferralLink} from '../libs/services/firebase-links';
import Share from 'react-native-share';
export function useInviteFriend() {
  /** 친구 초대 */
  const userId = useUserStore(s => s.user?.id);
  const invitingRef = useRef(false);
  const handleInvite = useCallback(() => {
    if (invitingRef.current || !userId) return;
    invitingRef.current = true;
    getMyReferralLink(userId).then(url => {
      Share.open({
        url,
      })
        .then(() => {
          return;
        })
        .catch(error => {
          return;
        })
        .finally(() => {
          invitingRef.current = false;
        });
    });
  }, [userId]);

  return handleInvite;
}
