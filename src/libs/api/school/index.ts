import {feanutAPI} from '..';
import {
  GetListSchoolRequest,
  GetListSchoolResponse,
} from '../../interfaces/school';

export const getListSchool = async (
  params: GetListSchoolRequest,
): Promise<GetListSchoolResponse> => {
  const res = await feanutAPI.get<GetListSchoolResponse>('/schools', {params});
  return res.data;
};
