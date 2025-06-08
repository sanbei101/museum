import { type Artifact, type Page } from './type';
import axiosInstance from './axios';

async function FetchArtifact(page: number, perPage: number): Promise<Page<Artifact>> {
  const response = await axiosInstance.get(`/artifacts`, {
    params: {
      page,
      perPage
    }
  });
  return response.data as Page<Artifact>;
}

async function UpdateArtifact(artifactId: string, data: Artifact): Promise<Artifact> {
  const response = await axiosInstance.put(`/artifacts/${artifactId}`, data);
  return response.data as Artifact;
}

async function CreateArtifact(data: Artifact): Promise<Artifact> {
  const response = await axiosInstance.post(`/artifacts`, data);
  return response.data as Artifact;
}
async function DeleteArtifact(artifactId: string) {
  const response = await axiosInstance.delete(`/artifacts/${artifactId}`);
  return response.data;
}
export { FetchArtifact, CreateArtifact, UpdateArtifact, DeleteArtifact };
