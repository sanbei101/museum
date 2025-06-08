import { type Artifact, type Page } from './type';
import axiosInstance from './axios';

const FetchArtifact = async (page: number, perPage: number): Promise<Page<Artifact>> => {
  const response = await axiosInstance.get(`/artifacts`, {
    params: {
      page,
      perPage
    }
  });
  return response.data as Page<Artifact>;
};

export { FetchArtifact };
