import { req } from '../apis/util';


export const createRoadmap = (roadmapTitle, nodes, connections, refConnections, description, nextNodeId, thumbnail, articles, essays) => req('/api/road_maps/', 'POST', {},
  { text: JSON.stringify({ nodes, connections, refConnections, nextNodeId, thumbnail }),
    title: roadmapTitle,
    description,
    articles,
    essays,
  });

export const updateRoadmap = (id, roadmapTitle, nodes, connections, refConnections, description, nextNodeId, thumbnail, bindEssay, articles, essays) => req(`/api/road_maps/${id}/`, 'PUT', {},
  { text: JSON.stringify({ nodes, connections, refConnections, nextNodeId, thumbnail, bindEssay }),
    title: roadmapTitle,
    description,
    articles,
    essays,
  });

export const getRoadmap = id => req(`/api/road_maps/${id}/`, 'GET');

export const updateRoadmapTitle = (id, roadmapTitle) => req(`/api/road_maps/${id}/`, 'PATCH', {},
  { title: roadmapTitle });

export const updateRoadmapDescription = (id, roadmapDescription) => req(`/api/road_maps/${id}/`, 'PATCH', {},
  { description: roadmapDescription });

export const delRoadmap = id => req(`/api/road_maps/${id}/`, 'DELETE');

export const postRoadmapShareLink = id => req('/api/share/roadmap/', 'POST', {}, { id });

export const getRoadmapShareLink = id => req(`/api/share/roadmap/${id}`, 'GET');

export const updateRoadmapTag = (id, tag) => req(`/api/road_maps/${id}/`, 'PATCH', {}, { tag });

export const createTag = name => req('/api/tags/', 'POST', {}, { name });

