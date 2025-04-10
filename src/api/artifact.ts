import { type Artifact, type Page } from "./type";
import { pb } from "./pocketbase";
const FetchArtifact = async (
  page: number,
  limit: number
): Promise<Page<Artifact>> => {
  const resultList = await pb.collection("artifacts").getList(page, limit, {
    sort: "-created",
  });

  return resultList as unknown as Page<Artifact>;
};

export { FetchArtifact };
