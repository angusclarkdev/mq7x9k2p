import { useState } from "react";
import type { Comment } from "../App";
import { formatDistanceToNow } from "date-fns";
import clsx from "clsx";
import { NewComment } from "./NewComment";

type CommentNodeProps = {
  comment: Comment;
  handleAddComment: (comment: Comment) => void;
  handleDeleteComment: (id: string) => void;
  className?: string;
};

export function CommentNode({
  comment,
  handleAddComment,
  handleDeleteComment,
  className,
}: CommentNodeProps) {
  const [isReplying, setIsReplying] = useState(false);

  return (
    <div className={clsx("space-y-4", className)}>
      <div className="bg-white dark:bg-white border-l-2 border-gray-200 dark:border-gray-200 pl-4 py-2 mb-2">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mb-1">
          <span className="font-medium text-blue-600 dark:text-blue-600">
            {comment.user}
          </span>
          <span>•</span>
          <span>
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        <div className="text-gray-900 dark:text-gray-900 text-sm mb-2 pr-2">
          {comment.content}
        </div>

        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={() => setIsReplying(true)}
            className="cursor-pointer text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-700 transition-colors font-medium"
          >
            Reply
          </button>
          <button
            onClick={() => handleDeleteComment(comment.id)}
            className="cursor-pointer text-gray-500 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-500 transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
      {isReplying && (
        <NewComment
          handleAddComment={(newComment) => {
            handleAddComment(newComment);
            setIsReplying(false);
          }}
          placeholder="Write a reply..."
          handleCancel={() => setIsReplying(false)}
          comment={comment}
        />
      )}
      {comment.children?.map((c) => (
        <CommentNode
          handleAddComment={handleAddComment}
          handleDeleteComment={handleDeleteComment}
          key={c.id}
          className="ml-6 border-l border-gray-100 dark:border-gray-100"
          comment={c}
        />
      ))}
    </div>
  );
}
