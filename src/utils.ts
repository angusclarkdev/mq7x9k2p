import type { Comment } from "./App";

export const updateCommentsTree = (
  comments: Comment[],
  comment: Comment
): Comment[] => {
  const updated = comments.map((c) => {
    if (c.id === comment.parentId) {
      const newChildren = [...c.children, comment];
      return {
        ...c,
        children: newChildren,
      };
    } else {
      if (c.children.length) {
        const result = updateCommentsTree(c.children, comment);
        const newChildren = result;
        return {
          ...c,
          children: newChildren,
        };
      }

      return c;
    }
  });

  return updated;
};

export const removeCommentFromTree = (
  comments: Comment[],
  commentId: string
): Comment[] => {
  const updated = comments
    .filter((c) => c.id !== commentId)
    .map((c) => ({
      ...c,
      children: removeCommentFromTree(c.children, commentId),
    }));

  return updated;
};

export const buildTreeFromFlat = (
  comments: Omit<Comment, "children">[]
): Comment[] => {
  const commentsByParentId: Record<string, Comment> = {};
  const results: Comment[] = [];

  comments.forEach((c) => {
    const fullCommentObject = {
      ...c,
      children: [],
    };

    commentsByParentId[fullCommentObject.id] = fullCommentObject;

    if (!fullCommentObject.parentId) {
      results.push(fullCommentObject);
    } else {
      const parent = commentsByParentId[fullCommentObject.parentId];
      if (parent) {
        parent.children.push(fullCommentObject);
      }
    }
  });

  return results;
};