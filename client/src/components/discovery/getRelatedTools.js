import { toolRegistry } from "../../tool-registry/toolRegistry";

export function getRelatedTools(currentTool) {
  return toolRegistry.filter(tool => {
    if (tool.id === currentTool.id) return false;

    const sameCategory =
      tool.category === currentTool.category;

    const sharedTags =
      (tool.tags || []).some(tag =>
        (currentTool.tags || []).includes(tag)
      );

    return sameCategory || sharedTags;
  }).slice(0, 6);
}
