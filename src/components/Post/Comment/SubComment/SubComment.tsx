import styles from "./styles.module.scss";
import Image from "next/image";
import moment from "moment";
import { Montserrat } from "next/font/google";
import commentIcon from "../../../../../public/post/comment.svg";
import LikeButton from "../../LikeButton/LikeButton";
import { subCommentLike } from "@/app/api/subComment/like/[subCommentId]/route";
import Link from "next/link";
import { subComment } from "@/app/api/subComment/types";
import { Prompt } from "next/font/google";
import { user } from "@/app/api/user/types";

const prompt = Prompt({ weight: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["latin"] });

const montserrat = Montserrat({ weight: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["latin"] });

interface componentProps {
  data: subComment;
  currentUser: user | null;
}

const SubComment = ({ data, currentUser }: componentProps) => {
  const date = new Date(data.createdAt);

  const formatedDate = moment(date);

  formatedDate.locale("pl");
  return (
    <div className={`${styles.reply}`}>
      <div className={`${styles.userData}`}>
        <div className={`${styles.wrapper1}`}>
          <Link href={`/${data.author.publicId}`}>
            <Image src={data.author.image} alt="Zdjęcie autora postu" width={64} height={64}></Image>
          </Link>
        </div>
        <div className={`${styles.wrapper2}`}>
          <Link href={`/${data.author.publicId}`}>
            <p className={`${montserrat.className}`}>{data.author.publicId}</p>
          </Link>
          <p className={`${montserrat.className}`}>
            {formatedDate.fromNow()} o {date.toLocaleTimeString("pl-PL", { hour: "numeric", minute: "numeric" })}
          </p>
        </div>
      </div>
      <div className={`${styles.content}`}>
        <p className={`${prompt.className}`}>
          {/* <span className={`${styles.replyTo}`}>@Disney+</span>  */}
          {data.content}
        </p>
      </div>
      <div className={`${styles.options}`}>
        <LikeButton
          onClickCallback={async (likesData) => {
            const { value } = likesData;
            await subCommentLike(data.id, value);
          }}
          currentLikes={data._count.likedBy}
          doesCurrentUserLikesThat={data.doesUserLikesThisSubComment}></LikeButton>
        <button className={`${montserrat.className}`}>
          <Image src={commentIcon} alt="Ikona"></Image>Odpowiedz <span> {data._count.postSubCommentReply}</span>
        </button>
      </div>
    </div>
  );
};

export default SubComment;
