import {useEffect, useState} from 'react';
import {getMySchool} from '../libs/api/school';
import {MySchool, School} from '../libs/interfaces/school';
import {useUserStore} from '../libs/stores';

export function useMySchool() {
  const userId = useUserStore(s => s.user?.id);
  const [school, setSchool] = useState<MySchool>();
  useEffect(() => {
    if (userId) {
      getMySchool()
        .then(setSchool)
        .catch(e => {});
    }
  }, [userId]);

  return {school};
}
