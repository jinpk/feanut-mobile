import {feanutAPI} from '..';
import {
  GetListSchoolRequest,
  GetListSchoolResponse,
  MySchool,
  PostMySchoolRequest,
} from '../../interfaces/school';

export const getListSchool = async (
  params: GetListSchoolRequest,
): Promise<GetListSchoolResponse> => {
  const res = await feanutAPI.get<GetListSchoolResponse>('/schools', {params});
  return res.data;
};

export const getMySchool = async (): Promise<MySchool> => {
  const res = await feanutAPI.get<MySchool>('/schools/users/me', {});
  return res.data;
};

export const postUpdateMySchool = async (body: PostMySchoolRequest) => {
  const res = await feanutAPI.post('/schools/users', body);
  return res.data;
};
