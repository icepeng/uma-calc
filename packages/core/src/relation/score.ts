import { relations } from '../data/relation';
import { relationMembers } from '../data/relation-members';

export interface Gene {
  charaId: number;
  blueStat?: {
    type: string;
    value: number;
  };
  redStat?: {
    type: string;
    value: number;
  };
  whiteStats: { type: string; value: number }[];
  parent1?: Gene;
  parent2?: Gene;
  gpScore: number;
}

function hasDupe(ids: number[]) {
  return ids.length > new Set(ids).size;
}

export function getRelationScore(...ids: number[]) {
  if (hasDupe(ids)) {
    return 0;
  }

  const relationSets = ids.map(
    (id) =>
      new Set(
        relationMembers
          .filter((item) => item.chara_id === id)
          .map((item) => item.relation_type)
      )
  );

  const sharedRelations = relations.filter((relation) =>
    relationSets.every((set) => set.has(relation.relation_type))
  );

  return sharedRelations
    .map((rel) => rel.relation_point)
    .reduce((sum, x) => sum + x, 0);
}

export function getScore(charaId: number, gene1: Gene, gene2: Gene) {
  const parent1 = getRelationScore(charaId, gene1.charaId);
  const parent2 = getRelationScore(charaId, gene2.charaId);
  const grandparent11 = gene1.parent1
    ? getRelationScore(charaId, gene1.charaId, gene1.parent1.charaId)
    : 0;
  const grandparent12 = gene1.parent2
    ? getRelationScore(charaId, gene1.charaId, gene1.parent2.charaId)
    : 0;
  const grandparent21 = gene2.parent1
    ? getRelationScore(charaId, gene2.charaId, gene2.parent1.charaId)
    : 0;
  const grandparent22 = gene2.parent2
    ? getRelationScore(charaId, gene2.charaId, gene2.parent2.charaId)
    : 0;
  const betweenParent = getRelationScore(gene1.charaId, gene2.charaId);

  return (
    parent1 +
    parent2 +
    grandparent11 +
    grandparent12 +
    grandparent21 +
    grandparent22 +
    betweenParent +
    gene1.gpScore +
    gene2.gpScore
  );
}
