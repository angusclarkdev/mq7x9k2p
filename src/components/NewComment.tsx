import { useState } from "react";
import { generateUsername } from "unique-username-generator";
import { v4 as uuidv4 } from "uuid";
import type { Comment } from "../App";

type NewCommentProps = {
  handleAddComment: (comment: Comment) => void;
  handleCancel?: () => void;
  comment?: Comment;
  placeholder?: string;
};

export function NewComment({
  comment,
  placeholder,
  handleAddComment,
  handleCancel,
}: NewCommentProps) {
  const [newComment, setCommentContent] = useState<string>("");

  return (
    <div className="rounded-2xl flex flex-col relative bg-white dark:bg-white ml-4 px-4 py-2 border-gray-200 dark:border-gray-200 border-2 focus-within:border-gray-500 dark:focus-within:border-gray-500">
      <input
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setCommentContent(e.currentTarget.value)
        }
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") {
            handleAddComment({
              parentId: comment?.id ?? null,
              createdAt: new Date().toISOString(),
              user: generateUsername(),
              content: newComment,
              id: uuidv4(),
              children: [],
            });
            setCommentContent("");
          }
        }}
        value={newComment}
        type="text"
        className="w-full ring-0 outline-0 text-gray-900 dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-500"
        placeholder={placeholder}
      />
      <div className="self-end flex gap-4">
        <button
          onClick={handleCancel}
          className="cursor-pointer text-gray-500 hover:text-red-500 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={() => {
            handleAddComment({
              parentId: comment?.id ?? null,
              createdAt: new Date().toISOString(),
              user: generateUsername(),
              content: newComment,
              id: uuidv4(),
              children: [],
            });
            setCommentContent("");
          }}
          className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors font-medium"
        >
          Comment
        </button>
      </div>
    </div>
  );
}
