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

const montserrat = Montserrat({ weight: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["latin"] });

const Post = () => {
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

  const date = new Date();

  date.setDate(new Date().getDate() - 5);

  const formatedDate = moment(date);

  formatedDate.locale("pl");

  return (
    <article className={`${styles.post}`} ref={mainParentElementRef}>
      <div className={`${styles.userData}`}>
        <div className={`${styles.wrapper1}`}>
          <Image src={testProfileImage} alt="Zdjęcie autora postu" width={64} height={64}></Image>
        </div>
        <div className={`${styles.wrapper2}`}>
          <p>Disney+</p>
          <p>
            {formatedDate.fromNow()} o {date.toLocaleTimeString("pl-PL", { hour: "numeric", minute: "numeric" })}
          </p>
        </div>
      </div>
      <div className={`${styles.content}`}>
        <p>
          Ty: Chętnie poznam kogoś nowego. <br></br>My: Nowe, ikoniczne trio już w Disney+. Poznajcie się! <br></br> Oglądaj nowe odcinki serialu „Percy Jackson
          i bogowie olimpijscy” w każdą środę w Disney+. 🔱
        </p>
        <div className={`${styles.images}`}>
          <div className={`${styles.image}`}>
            <Image src={testPostImage} alt="Zdjęcie posta"></Image>
          </div>
          <div className={`${styles.image}`}>
            <Image src={testPostImage1} alt="Zdjęcie posta"></Image>
          </div>
          <div className={`${styles.image}`}>
            <Image src={testPostImage} alt="Zdjęcie posta"></Image>
          </div>
          <div className={`${styles.image}`}>
            <Image src={testPostImage} alt="Zdjęcie posta"></Image>
          </div>
          <div className={`${styles.image}`}>
            <Image src={testPostImage} alt="Zdjęcie posta"></Image>
          </div>
          <div className={`${styles.image}`}>
            <Image src={testPostImage} alt="Zdjęcie posta"></Image>
          </div>
          <div className={`${styles.image}`}>
            <Image src={testPostImage} alt="Zdjęcie posta"></Image>
          </div>
          <div className={`${styles.image}`}>
            <Image src={testPostImage} alt="Zdjęcie posta"></Image>
          </div>
          <div className={`${styles.image}`}>
            <Image src={testPostImage} alt="Zdjęcie posta"></Image>
          </div>
          <div className={`${styles.image}`}>
            <Image src={testPostImage} alt="Zdjęcie posta"></Image>
          </div>
          <div className={`${styles.image}`}>
            <Image src={testPostImage} alt="Zdjęcie posta"></Image>
          </div>
        </div>
        <div className={`${styles.options}`}>
          <button className={`${montserrat.className}`}>
            <Image src={heartIcon} alt="Ikona"></Image> Polub <span>3 408</span>
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
        <div className={`${styles.comments} ${areCommentsOpen ? styles.open : ""}`}>
          <div className={`${styles.sendComment}`}>
            <div className={`${styles.userData}`}>
              <div className={`${styles.wrapper1}`}>
                <Image src={testProfileImage} alt="Zdjęcie autora postu" width={64} height={64}></Image>
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
        </div>
      </div>
    </article>
  );
};

export default Post;
