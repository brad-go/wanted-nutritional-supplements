import { API_URL } from '~constants/index';
import { ApiReturnType } from '~types/index';

export const fetchApi = async () => {
  const result = await fetch(API_URL);
  const data: ApiReturnType = await result.json();
  return data;
};
