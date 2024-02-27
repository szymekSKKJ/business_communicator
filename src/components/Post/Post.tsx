"use client";

import styles from "./styles.module.scss";
import commentIcon from "../../../public/post/comment.svg";
import shareIcon from "../../../public/post/share.svg";
import Image from "next/image";
import moment from "moment";
import "moment/locale/pl";
import { Montserrat, Prompt } from "next/font/google";
import Comment, { SkeletonLoadingComment } from "./Comment/Comment";
import { useLayoutEffect, useState } from "react";
import { postLike } from "@/app/api/post/like/[postId]/route";
import { comment, commentGetSome } from "@/app/api/comment/getSome/[postId]/route";
import { commentCreate } from "@/app/api/comment/create/[postId]/route";
import LikeButton from "./LikeButton/LikeButton";
import Link from "next/link";
import SendComment from "./SendComment/SendComment";
import { post } from "@/app/api/post/types";
import { user } from "@/app/api/user/types";

const prompt = Prompt({ weight: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["latin"] });
const montserrat = Montserrat({ weight: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["latin"] });

interface componentProps {
  postData: post;
  currentUser: user | null;
}

const Post = ({ postData, currentUser }: componentProps) => {
  const [areCommentsOpen, setAreCommentsOpen] = useState(false);
  const [comments, setComments] = useState<comment[]>([]);
  const [areCommentsLoading, setAreCommentsLoading] = useState(false);

  const date = new Date(postData.createdAt);

  const formatedDate = moment(date);

  formatedDate.locale("pl");

  useLayoutEffect(() => {
    if (comments.length === 0 && areCommentsOpen) {
      (async () => {
        const response = await commentGetSome(postData.id);

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
            <Image src={postData.author.profileImage} alt="Zdjęcie autora postu" width={64} height={64}></Image>
          </Link>
        </div>
        <div className={`${styles.wrapper2}`}>
          <Link href={`/${postData.author.publicId}`}>
            <p>{postData.author.publicId}</p>
          </Link>
          <p>
            {formatedDate.fromNow()} o {date.toLocaleTimeString("pl-PL", { hour: "numeric", minute: "numeric" })}
          </p>
        </div>
      </div>
      <div className={`${styles.content} ${prompt.className}`}>
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
            doesCurrentUserLikesThat={postData.doesCurrentUserLikesThisPost}
            onClickCallback={async (likesData) => {
              const { value } = likesData;
              currentUser && (await postLike(postData.id, value));
            }}></LikeButton>

          <button
            className={`${montserrat.className}`}
            onClick={async () => {
              setAreCommentsOpen((currentValue) => (currentValue === false ? true : false));
              if (comments.length === 0) {
                setAreCommentsLoading(true);
              }
            }}>
            <Image src={commentIcon} alt="Ikona"></Image>Skomentuj <span> {comments.length === 0 ? postData._count.comments : comments.length}</span>
          </button>
          <button className={`${montserrat.className}`}>
            <Image src={shareIcon} alt="Ikona"></Image>Udostępnij <span>{postData._count.sharedBy}</span>
          </button>
        </div>
        <div className={`${styles.comments} ${areCommentsOpen ? styles.open : ""}`}>
          {currentUser && (
            <SendComment
              currentUser={currentUser}
              isOpen={areCommentsOpen}
              onSend={async (_event, textareaValue) => {
                await commentCreate(postData.id, textareaValue.replace(/\s+/g, " ").trim());

                setComments((currentValue) => {
                  const copiedCurrentValue = structuredClone(currentValue);

                  copiedCurrentValue.unshift({
                    content: textareaValue.replace(/\s+/g, " ").trim(),
                    id: crypto.randomUUID(),
                    _count: {
                      postSubComment: 0,
                      likedBy: 0,
                    },
                    createdAt: new Date(),
                    doesCurrentUserLikesThisComment: false,
                    author: {
                      id: currentUser.id,
                      name: currentUser.name,
                      publicId: currentUser.publicId!,
                      profileImage: currentUser.profileImage,
                    },
                  });

                  return copiedCurrentValue;
                });
              }}></SendComment>
          )}
          {postData.mostLikedComment && (
            <Comment
              currentUser={currentUser}
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
                    currentUser={currentUser}
                    key={commentData.id}
                    data={commentData}
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
