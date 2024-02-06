"use client";

import styles from "./styles.module.scss";
import commentIcon from "../../../public/post/comment.svg";
import shareIcon from "../../../public/post/share.svg";
import Image from "next/image";
import moment from "moment";
import "moment/locale/pl";
import { Montserrat } from "next/font/google";
import Comment, { SkeletonLoadingComment } from "./Comment/Comment";
import { useLayoutEffect, useState } from "react";

import { postLike } from "@/app/api/post/like/[postId]/route";
import { comment, commentGetSome } from "@/app/api/comment/getSome/[postId]/route";
import { commentCreate } from "@/app/api/comment/create/[postId]/route";
import LikeButton from "./LikeButton/LikeButton";
import Link from "next/link";
import SendComment from "./SendComment/SendComment";
import { post } from "@/app/api/post/types";

const montserrat = Montserrat({ weight: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["latin"] });

interface componentProps {
  userImageUrl: string;
  publicId: string;
  postData: post;
  userId: string;
}

const Post = ({ userImageUrl, publicId, postData, userId }: componentProps) => {
  const [areCommentsOpen, setAreCommentsOpen] = useState(false);
  const [comments, setComments] = useState<comment[]>([]);
  const [areCommentsLoading, setAreCommentsLoading] = useState(false);

  const date = new Date(postData.createdAt);

  const formatedDate = moment(date);

  formatedDate.locale("pl");

  useLayoutEffect(() => {
    if (comments.length === 0 && areCommentsOpen) {
      (async () => {
        const response = await commentGetSome(postData.id, userId);
        if (response.error === null) {
          setComments(response.data!);
        }

        setAreCommentsLoading(false);
      })();
    } else if (areCommentsOpen === false) {
      setAreCommentsLoading(false);
    }
  }, [areCommentsOpen]);

  return (
    <article className={`${styles.post}`}>
      <div className={`${styles.userData}`}>
        <div className={`${styles.wrapper1}`}>
          <Link href={`/${postData.author.publicId}`}>
            <Image src={userImageUrl} alt="Zdjęcie autora postu" width={64} height={64}></Image>
          </Link>
        </div>
        <div className={`${styles.wrapper2}`}>
          <Link href={`/${postData.author.publicId}`}>
            <p>{publicId}</p>
          </Link>
          <p>
            {formatedDate.fromNow()} o {date.toLocaleTimeString("pl-PL", { hour: "numeric", minute: "numeric" })}
          </p>
        </div>
      </div>
      <div className={`${styles.content}`}>
        <p>{postData.content}</p>
        {postData.imagesData.length !== 0 && (
          <div className={`${styles.images}`}>
            {postData.imagesData
              .sort((a, b) => a.order - b.order)
              .map((imageData) => {
                const { id, url } = imageData;

                return (
                  <div
                    className={`${styles.image}`}
                    key={id}
                    onClick={() => {
                      window.open(url);
                    }}>
                    <Image src={url} alt="Zdjęcie posta" width={2048} height={2048}></Image>
                  </div>
                );
              })}
          </div>
        )}

        <div className={`${styles.options}`}>
          <LikeButton
            currentLikes={postData._count.likedBy}
            doesUserLikesThisPost={postData.doesUserLikesThisPost}
            onClickCallback={async (likesData) => {
              const { value } = likesData;
              await postLike(postData.id, userId, value);
            }}></LikeButton>

          <button
            className={`${montserrat.className}`}
            onClick={async () => {
              setAreCommentsOpen((currentValue) => (currentValue === false ? true : false));
              if (comments.length === 0) {
                setAreCommentsLoading(true);
              }
            }}>
            <Image src={commentIcon} alt="Ikona"></Image>Skomentuj <span> {postData._count.comments}</span>
          </button>
          <button className={`${montserrat.className}`}>
            <Image src={shareIcon} alt="Ikona"></Image>Udostępnij <span>{postData._count.sharedBy}</span>
          </button>
        </div>
        <div className={`${styles.comments} ${areCommentsOpen ? styles.open : ""}`}>
          <SendComment
            publicId={publicId}
            userImageUrl={userImageUrl}
            isOpen={areCommentsOpen}
            onSend={async (_event, textareaValue) => {
              await commentCreate(postData.id, userId, textareaValue.replace(/\s+/g, " ").trim());
            }}></SendComment>
          {postData.mostLikedComment && (
            <Comment
              userImageUrl={userImageUrl}
              publicId={publicId}
              userId={userId}
              key={postData.mostLikedComment.id}
              setAreCommentsOpen={setAreCommentsOpen}
              areCommentsOpen={areCommentsOpen}
              data={postData.mostLikedComment}></Comment>
          )}

          {areCommentsLoading ? (
            <>
              <SkeletonLoadingComment></SkeletonLoadingComment>
              <SkeletonLoadingComment></SkeletonLoadingComment>
              <SkeletonLoadingComment></SkeletonLoadingComment>
            </>
          ) : (
            comments.map((commentData) => {
              if (postData.mostLikedComment && commentData.id !== postData.mostLikedComment.id) {
                return (
                  <Comment
                    key={commentData.id}
                    data={commentData}
                    userImageUrl={userImageUrl}
                    publicId={publicId}
                    userId={userId}
                    areCommentsOpen={areCommentsOpen}
                    setAreCommentsOpen={setAreCommentsOpen}></Comment>
                );
              }
            })
          )}

          {comments.length !== 0 && (
            <button
              className={`${styles.readMore}`}
              onClick={async () => {
                setAreCommentsOpen(true);
              }}>
              Czytaj więcej
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default Post;
