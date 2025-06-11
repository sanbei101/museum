import { type Artifact, type Page } from './type';
import { useArtifactStore } from '@/store';
const artifactStore = useArtifactStore();

async function FetchArtifact(page: number, perPage: number): Promise<Page<Artifact>> {
  return artifactStore.fetchArtifacts(page, perPage);
}

async function UpdateArtifact(artifactId: string, data: Artifact): Promise<Artifact> {
  return artifactStore.updateArtifact(artifactId, data);
}

async function CreateArtifact(data: Omit<Artifact, 'id'>): Promise<Artifact> {
  return artifactStore.createArtifact(data);
}
async function DeleteArtifact(artifactId: string) {
  return artifactStore.deleteArtifact(artifactId);
}
export { FetchArtifact, CreateArtifact, UpdateArtifact, DeleteArtifact };
