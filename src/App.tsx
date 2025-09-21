import { useEffect, useState } from "react";
import type { RxCollection } from "rxdb";
import { addRxPlugin, createRxDatabase } from "rxdb/plugins/core";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { getRxStorageLocalstorage } from "rxdb/plugins/storage-localstorage";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";
import { CommentNode } from "./components/CommentNode";
import { NewComment } from "./components/NewComment";
import {
  buildTreeFromFlat,
  removeCommentFromTree,
  updateCommentsTree,
} from "./utils";

export type Comment = {
  id: string;
  user: string;
  parentId: string | null;
  content: string;
  children: Comment[];
  createdAt: string;
};

const commentSchema = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: { type: "string", maxLength: 100 },
    user: { type: "string" },
    parentId: { type: ["string", "null"] },
    content: { type: "string" },
    createdAt: { type: "string" },
  },
};

export default function App() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [database, setDatabase] = useState<{
    comments: RxCollection<Omit<Comment, "children">>;
  } | null>(null);

  // Load the localStorage DB on mount
  useEffect(() => {
    addRxPlugin(RxDBDevModePlugin);

    async function createDb() {
      const db = await createRxDatabase({
        name: "autoarc",
        storage: wrappedValidateAjvStorage({
          storage: getRxStorageLocalstorage(),
        }),
        ignoreDuplicate: true,
      });

      const commentsCollection = await db.addCollections({
        comments: { schema: commentSchema },
      });

      setDatabase(commentsCollection);
    }

    createDb();
  }, []);

  // Set initial app state from DB once loaded
  useEffect(() => {
    if (database) {
      database.comments
        .find()
        .exec()
        .then((flatComments) => {
          if (flatComments.length > 0) {
            const plainComments = flatComments.map((doc) => doc.toJSON());

            const treeComments = buildTreeFromFlat(plainComments);
            setComments(treeComments);
          }
        })
        .catch((error) => {
          console.error("Error loading comments from database:", error);
        });
    }
  }, [database]);

  const addComment = async (comment: Comment) => {
    const updatedComments =
      comment.parentId === null
        ? [...comments, comment]
        : updateCommentsTree(comments, comment);

    setComments(updatedComments);

    if (database) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { children, ...flatComment } = comment;
      await database.comments.insert(flatComment);
    }
  };

  const deleteComment = async (commentId: string) => {
    const updatedComments = removeCommentFromTree(comments, commentId);
    setComments(updatedComments);

    if (database) {
      await database.comments.findOne(commentId).remove();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-900 mb-6">
          Reddit Clone
        </h1>
        <div className="space-y-5">
          {comments.map((c) => (
            <CommentNode
              handleAddComment={addComment}
              handleDeleteComment={deleteComment}
              key={c.id}
              comment={c}
            />
          ))}
          <NewComment
            placeholder="Write a comment..."
            handleAddComment={addComment}
          />
        </div>
      </div>
    </div>
  );
}
