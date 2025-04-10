import { type Artifact } from "./type";
import { pb } from "./pocketbase";
const FetchArtifact = async (
  page: number,
  limit: number
): Promise<Artifact[]> => {
  const resultList = await pb.collection("artifacts").getList(page, limit, {
    sort: "-created",
  });

  return resultList.items as unknown as Artifact[];
};

export { FetchArtifact };
