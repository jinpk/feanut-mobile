import {useEffect, useState} from 'react';
import {getMySchool} from '../libs/api/school';
import {MySchool} from '../libs/interfaces/school';

export function useMySchool(userId: string) {
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
