"use client";

import styles from "./styles.module.scss";
import testProfileImage from "../../../public/test_profile_image.jpg";
import testPostImage from "../../../public/test_post_image.jpg";
import testPostImage1 from "../../../public/test_post_image2.jpg";
import heartIcon from "../../../public/post/heart.svg";
import commentIcon from "../../../public/post/comment.svg";
import shareIcon from "../../../public/post/share.svg";
import Image from "next/image";
import moment from "moment";
import "moment/locale/pl";
import { Montserrat } from "next/font/google";
import Comment from "./Comment/Comment";
import { useRef, useState } from "react";
import Button from "../UI/Button/Button";
import Textarea from "../UI/Textarea/Textarea";
import { post } from "@/app/api/post/getSome/[userId]/route";
import { postLike } from "@/app/api/post/like/[postId]/route";

const montserrat = Montserrat({ weight: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["latin"] });

interface componentProps {
  userImageUrl: string;
  username: string;
  postData: post;
  userId: string;
}

const Post = ({ userImageUrl, username, postData, userId }: componentProps) => {
  const [comments, setComments] = useState([
    {
      id: 1,
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. `,
      username: "Disney+",
    },
    {
      id: 2,
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. `,
      username: "Disney+",
    },
    {
      id: 3,
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. `,
      username: "Disney+",
    },
  ]);
  const [areCommentsOpen, setAreCommentsOpen] = useState(false);

  const mainParentElementRef = useRef<null | HTMLElement>(null);

  const date = new Date(postData.createdAt);

  const formatedDate = moment(date);

  formatedDate.locale("pl");

  return (
    <article className={`${styles.post}`} ref={mainParentElementRef}>
      <div className={`${styles.userData}`}>
        <div className={`${styles.wrapper1}`}>
          <Image src={userImageUrl} alt="Zdjęcie autora postu" width={64} height={64}></Image>
        </div>
        <div className={`${styles.wrapper2}`}>
          <p>{username}</p>
          <p>
            {formatedDate.fromNow()} o {date.toLocaleTimeString("pl-PL", { hour: "numeric", minute: "numeric" })}
          </p>
        </div>
      </div>
      <div className={`${styles.content}`}>
        <p>{postData.content}</p>
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
        <div className={`${styles.options}`}>
          <button
            className={`${montserrat.className}`}
            onClick={async () => {
              const k = await postLike(postData.id, userId);

              console.log(k);
            }}>
            <Image src={heartIcon} alt="Ikona"></Image> Polub <span>{postData._count.likedBy}</span>
          </button>
          <button
            className={`${montserrat.className}`}
            onClick={() => {
              setAreCommentsOpen((currentValue) => (currentValue === false ? true : false));

              setComments([
                {
                  id: 1,
                  content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. `,
                  username: "Disney+",
                },
                {
                  id: 2,
                  content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam aliquam mauris quis bibendum tristique. Maecenas feugiat orci et ipsum convallis
              consectetur ut pellentesque lacus. Pellentesque sagittis felis non nibh facilisis, ac sodales ante interdum. Etiam ullamcorper laoreet aliquam.
              Quisque ut venenatis augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse ac ligula ultrices, feugiat lorem id, maximus
              dui.`,
                  username: "Disney+",
                },
                {
                  id: 3,
                  content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam aliquam mauris quis bibendum tristique. Maecenas feugiat orci et ipsum convallis
              consectetur ut pellentesque lacus. Pellentesque sagittis felis non nibh facilisis, ac sodales ante interdum. Etiam ullamcorper laoreet aliquam.
              Quisque ut venenatis augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse ac ligula ultrices, feugiat lorem id, maximus
              dui.`,
                  username: "Disney+",
                },
                {
                  id: 4,
                  content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam aliquam mauris quis bibendum tristique. Maecenas feugiat orci et ipsum convallis
              consectetur ut pellentesque lacus. Pellentesque sagittis felis non nibh facilisis, ac sodales ante interdum. Etiam ullamcorper laoreet aliquam.
              Quisque ut venenatis augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse ac ligula ultrices, feugiat lorem id, maximus
              dui.`,
                  username: "Disney+",
                },
              ]);

              if (mainParentElementRef.current) {
                const textareaElement = mainParentElementRef.current.querySelector("#textarea") as HTMLTextAreaElement;

                if (areCommentsOpen === false) {
                  setTimeout(() => {
                    textareaElement.focus();
                  }, 600); // Time of displaying comments animation
                }
              }
            }}>
            <Image src={commentIcon} alt="Ikona"></Image>Skomentuj <span> 5 433</span>
          </button>
          <button className={`${montserrat.className}`}>
            <Image src={shareIcon} alt="Ikona"></Image>Udostępnij <span>10k+ </span>
          </button>
        </div>
        {/* <div className={`${styles.comments} ${areCommentsOpen ? styles.open : ""}`}>
          <div className={`${styles.sendComment}`}>
            <div className={`${styles.userData}`}>
              <div className={`${styles.wrapper1}`}>
                <Image src={userImageUrl} alt="Zdjęcie autora postu" width={64} height={64}></Image>
              </div>
              <div className={`${styles.wrapper2}`}>
                <p>Disney+</p>
                <p>{moment(new Date()).locale("pl").fromNow()}</p>
              </div>
            </div>
            <Textarea id="textarea" placeholder="Napisz komentarz"></Textarea>
            <Button>Wyślij</Button>
          </div>
          {comments.map((commentData) => {
            const { content, username, id } = commentData;

            return <Comment key={id} content={content} username={username}></Comment>;
          })}
          <button
            className={`${styles.readMore}`}
            onClick={() => {
              setAreCommentsOpen(true);
              setComments([
                {
                  id: 1,
                  content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. `,
                  username: "Disney+",
                },
                {
                  id: 2,
                  content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam aliquam mauris quis bibendum tristique. Maecenas feugiat orci et ipsum convallis
              consectetur ut pellentesque lacus. Pellentesque sagittis felis non nibh facilisis, ac sodales ante interdum. Etiam ullamcorper laoreet aliquam.
              Quisque ut venenatis augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse ac ligula ultrices, feugiat lorem id, maximus
              dui.`,
                  username: "Disney+",
                },
                {
                  id: 3,
                  content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam aliquam mauris quis bibendum tristique. Maecenas feugiat orci et ipsum convallis
              consectetur ut pellentesque lacus. Pellentesque sagittis felis non nibh facilisis, ac sodales ante interdum. Etiam ullamcorper laoreet aliquam.
              Quisque ut venenatis augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse ac ligula ultrices, feugiat lorem id, maximus
              dui.`,
                  username: "Disney+",
                },
                {
                  id: 4,
                  content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam aliquam mauris quis bibendum tristique. Maecenas feugiat orci et ipsum convallis
              consectetur ut pellentesque lacus. Pellentesque sagittis felis non nibh facilisis, ac sodales ante interdum. Etiam ullamcorper laoreet aliquam.
              Quisque ut venenatis augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse ac ligula ultrices, feugiat lorem id, maximus
              dui.`,
                  username: "Disney+",
                },
                {
                  id: 5,
                  content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam aliquam mauris quis bibendum tristique. Maecenas feugiat orci et ipsum convallis
              consectetur ut pellentesque lacus. Pellentesque sagittis felis non nibh facilisis, ac sodales ante interdum. Etiam ullamcorper laoreet aliquam.
              Quisque ut venenatis augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse ac ligula ultrices, feugiat lorem id, maximus
              dui.`,
                  username: "Disney+",
                },
                {
                  id: 6,
                  content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam aliquam mauris quis bibendum tristique. Maecenas feugiat orci et ipsum convallis
              consectetur ut pellentesque lacus. Pellentesque sagittis felis non nibh facilisis, ac sodales ante interdum. Etiam ullamcorper laoreet aliquam.
              Quisque ut venenatis augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse ac ligula ultrices, feugiat lorem id, maximus
              dui.`,
                  username: "Disney+",
                },
                {
                  id: 7,
                  content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam aliquam mauris quis bibendum tristique. Maecenas feugiat orci et ipsum convallis
              consectetur ut pellentesque lacus. Pellentesque sagittis felis non nibh facilisis, ac sodales ante interdum. Etiam ullamcorper laoreet aliquam.
              Quisque ut venenatis augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse ac ligula ultrices, feugiat lorem id, maximus
              dui.`,
                  username: "Disney+",
                },
                {
                  id: 8,
                  content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam aliquam mauris quis bibendum tristique. Maecenas feugiat orci et ipsum convallis
              consectetur ut pellentesque lacus. Pellentesque sagittis felis non nibh facilisis, ac sodales ante interdum. Etiam ullamcorper laoreet aliquam.
              Quisque ut venenatis augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse ac ligula ultrices, feugiat lorem id, maximus
              dui.`,
                  username: "Disney+",
                },
                {
                  id: 9,
                  content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam aliquam mauris quis bibendum tristique. Maecenas feugiat orci et ipsum convallis
              consectetur ut pellentesque lacus. Pellentesque sagittis felis non nibh facilisis, ac sodales ante interdum. Etiam ullamcorper laoreet aliquam.
              Quisque ut venenatis augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse ac ligula ultrices, feugiat lorem id, maximus
              dui.`,
                  username: "Disney+",
                },
              ]);
            }}>
            Czytaj więcej
          </button>
        </div> */}
      </div>
    </article>
  );
};

export default Post;
