"use client";

import styles from "./styles.module.scss";
import commentIcon from "../../../../public/post/comment.svg";
import Image from "next/image";
import moment from "moment";
import { Montserrat } from "next/font/google";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { commentLike } from "@/app/api/comment/like/[commentId]/route";
import { comment } from "@/app/api/comment/getSome/[postId]/route";
import LikeButton from "../LikeButton/LikeButton";
import Link from "next/link";
import { subCommentCreate } from "@/app/api/subComment/create/[commentId]/route";
import { subCommentGetSome } from "@/app/api/subComment/getSome/[commentId]/route";
import SubComment from "./SubComment/SubComment";
import SendComment from "../SendComment/SendComment";
import { subComment } from "@/app/api/subComment/types";

const montserrat = Montserrat({ weight: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["latin"] });

interface componentProps {
  userImageUrl: string;
  publicId: string;
  userId: string;
  data: comment;
  setAreCommentsOpen: Dispatch<SetStateAction<boolean>>;
  areCommentsOpen: boolean;
}

const Comment = ({ data, userImageUrl, publicId, userId, setAreCommentsOpen, areCommentsOpen }: componentProps) => {
  const [areSubCommentsOpen, setAreSubCommentsOpen] = useState(false);
  const [subComments, setSubComments] = useState<subComment[]>([]);
  const [areSubCommentsLoading, setAreSubCommentsLoading] = useState(false);

  const date = new Date(data.createdAt);

  const formatedDate = moment(date);

  formatedDate.locale("pl");

  useEffect(() => {
    if (subComments.length === 0 && areSubCommentsOpen) {
      (async () => {
        const response = await subCommentGetSome(data.id, userId);

        if (response.error === null) {
          setSubComments(response.data!);
        }

        setAreSubCommentsLoading(false);
      })();
    }
  }, [areSubCommentsOpen]);

  useEffect(() => {
    if (areCommentsOpen === false) {
      setAreSubCommentsOpen(false);
    }
  }, [areCommentsOpen]);

  return (
    <div className={`${styles.comment}`}>
      <div className={`${styles.userData}`}>
        <div className={`${styles.wrapper1}`}>
          <Link href={`/${data.author.publicId}`}>
            <Image src={userImageUrl} alt="Zdjęcie autora postu" width={64} height={64}></Image>
          </Link>
        </div>
        <div className={`${styles.wrapper2}`}>
          <Link href={`/${data.author.publicId}`}>
            <p>{publicId}</p>
          </Link>
          <p>
            {formatedDate.fromNow()} o {date.toLocaleTimeString("pl-PL", { hour: "numeric", minute: "numeric" })}
          </p>
        </div>
      </div>
      <div className={`${styles.content}`}>
        <p>{data.content}</p>
      </div>
      <div className={`${styles.options}`}>
        <LikeButton
          onClickCallback={async (likesData) => {
            const { value } = likesData;
            await commentLike(data.id, userId, value);
          }}
          currentLikes={data._count.likedBy}
          doesUserLikesThisPost={data.doesUserLikesThisComment}></LikeButton>
        <button
          className={`${montserrat.className}`}
          onClick={() => {
            setAreCommentsOpen(true);
            setAreSubCommentsOpen((currentValue) => (currentValue === false ? true : false));

            if (subComments.length === 0) {
              setAreSubCommentsLoading(true);
            }
          }}>
          <Image src={commentIcon} alt="Ikona"></Image>Skomentuj <span>{data._count.postSubComment}</span>
        </button>
      </div>
      <div className={`${styles.subComments} ${areSubCommentsOpen ? styles.open : ""}`}>
        <SendComment
          publicId={publicId}
          userImageUrl={userImageUrl}
          isOpen={areSubCommentsOpen}
          onSend={async (_event, textareaValue) => {
            await subCommentCreate(data.id, userId, textareaValue.replace(/\s+/g, " ").trim());
          }}></SendComment>

        {areSubCommentsLoading ? (
          <>
            <SkeletonLoadingComment></SkeletonLoadingComment>
            <SkeletonLoadingComment></SkeletonLoadingComment>
            <SkeletonLoadingComment></SkeletonLoadingComment>
          </>
        ) : (
          subComments.map((subCommentData) => {
            const { id } = subCommentData;
            return <SubComment key={id} data={subCommentData} userId={userId}></SubComment>;
          })
        )}

        <button className={`${styles.readMore}`}>Czytaj więcej</button>
      </div>
    </div>
  );
};

export default Comment;

const SkeletonLoadingComment = () => {
  return (
    <div className={`${styles.comment} ${styles.skeletonLoadingComment}`}>
      <div className={`${styles.userData}`}>
        <div className={`${styles.wrapper1}`}></div>
        <div className={`${styles.wrapper2}`}>
          <p></p>
          <p></p>
        </div>
      </div>
      <div className={`${styles.content}`}>
        <p></p>
      </div>
      <div className={`${styles.options}`}>
        <button></button>
        <button></button>
      </div>
    </div>
  );
};

export { SkeletonLoadingComment };
