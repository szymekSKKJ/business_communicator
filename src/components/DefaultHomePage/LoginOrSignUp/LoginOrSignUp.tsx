import styles from "./styles.module.scss";
import googleIcon from "../../../../public/providers/google.png";
import Image from "next/image";
import { userGetSomeRecentlyJoined } from "@/app/api/user/getSomeRecentlyJoined/route";
import starImage from "../../../../public/star.svg";
import Button from "@/components/UI/Button/Button";
import ClientButtonsWrapperForChangingOffestOfUsers from "./ClientButtonsWrapperForChangingOffestOfUsers/ClientButtonsWrapperForChangingOffestOfUsers";
import logoLongImage from "../../../../public/logo.svg";
import Link from "next/link";
import LoginButton from "./LoginButton/LoginButton";

const LoginOrSignUp = async () => {
  const recentlyJoinedUsersResponse = await userGetSomeRecentlyJoined();

  return (
    <div className={`${styles.loginOrSignUp}`}>
      <div className={`${styles.content}`}>
        <h1>Become part of the largest business world!</h1>
        <h2>They have already become</h2>
        <div className={`${styles.newUsers}`}>
          <ClientButtonsWrapperForChangingOffestOfUsers></ClientButtonsWrapperForChangingOffestOfUsers>
          <div className={`${styles.usersWrapper}`}>
            <div className={`${styles.users}`}>
              {recentlyJoinedUsersResponse.data &&
                recentlyJoinedUsersResponse.data.map((data) => {
                  const { id, profileImage, description, publicId, averageOpinion, _count } = data;

                  return (
                    <>
                      <div className={`${styles.userCard}`} key={id}>
                        <div className={`${styles.imageWrapper}`}>
                          <Image src={profileImage} width={100} height={100} alt="User's profile image"></Image>
                        </div>
                        <p className={`${styles.publicId}`}>{publicId}</p>
                        <p className={`${styles.description} normalText`}>{description}</p>
                        <span className={`${styles.opinion}`}>
                          <p>{averageOpinion === null ? "0" : averageOpinion}</p>
                          <Image src={starImage} alt="Star image"></Image>
                        </span>
                        <p className={`${styles.opinionsCounter}`}>of {_count.opinions} opinions</p>
                        <Link href={`/${publicId}`}>
                          <Button>View profile</Button>
                        </Link>
                      </div>
                      <div className={`${styles.userCard}`} key={id}>
                        <div className={`${styles.imageWrapper}`}>
                          <Image src={profileImage} width={100} height={100} alt="User's profile image"></Image>
                        </div>
                        <p className={`${styles.publicId}`}>{publicId}</p>
                        <p className={`${styles.description} normalText`}>{description}</p>
                        <span className={`${styles.opinion}`}>
                          <p>{averageOpinion === null ? "0" : averageOpinion}</p>
                          <Image src={starImage} alt="Star image"></Image>
                        </span>
                        <p className={`${styles.opinionsCounter}`}>of {_count.opinions} opinions</p>
                        <Link href={`/${publicId}`}>
                          <Button>View profile</Button>
                        </Link>
                      </div>
                      <div className={`${styles.userCard}`} key={id}>
                        <div className={`${styles.imageWrapper}`}>
                          <Image src={profileImage} width={100} height={100} alt="User's profile image"></Image>
                        </div>
                        <p className={`${styles.publicId}`}>{publicId}</p>
                        <p className={`${styles.description} normalText`}>{description}</p>
                        <span className={`${styles.opinion}`}>
                          <p>{averageOpinion === null ? "0" : averageOpinion}</p>
                          <Image src={starImage} alt="Star image"></Image>
                        </span>
                        <p className={`${styles.opinionsCounter}`}>of {_count.opinions} opinions</p>
                        <Link href={`/${publicId}`}>
                          <Button>View profile</Button>
                        </Link>
                      </div>
                      <div className={`${styles.userCard}`} key={id}>
                        <div className={`${styles.imageWrapper}`}>
                          <Image src={profileImage} width={100} height={100} alt="User's profile image"></Image>
                        </div>
                        <p className={`${styles.publicId}`}>{publicId}</p>
                        <p className={`${styles.description} normalText`}>{description}</p>
                        <span className={`${styles.opinion}`}>
                          <p>{averageOpinion === null ? "0" : averageOpinion}</p>
                          <Image src={starImage} alt="Star image"></Image>
                        </span>
                        <p className={`${styles.opinionsCounter}`}>of {_count.opinions} opinions</p>
                        <Link href={`/${publicId}`}>
                          <Button>View profile</Button>
                        </Link>
                      </div>
                      <div className={`${styles.userCard}`} key={id}>
                        <div className={`${styles.imageWrapper}`}>
                          <Image src={profileImage} width={100} height={100} alt="User's profile image"></Image>
                        </div>
                        <p className={`${styles.publicId}`}>{publicId}</p>
                        <p className={`${styles.description} normalText`}>{description}</p>
                        <span className={`${styles.opinion}`}>
                          <p>{averageOpinion === null ? "0" : averageOpinion}</p>
                          <Image src={starImage} alt="Star image"></Image>
                        </span>
                        <p className={`${styles.opinionsCounter}`}>of {_count.opinions} opinions</p>
                        <Link href={`/${publicId}`}>
                          <Button>View profile</Button>
                        </Link>
                      </div>
                    </>
                  );
                })}
            </div>
          </div>
        </div>
        <div className={`${styles.joinUsWrapper}`}>
          <div className={`${styles.textWrapper}`}>
            <p>Join to</p>
            <div className={`${styles.logoWrapper}`}>
              <Image src={logoLongImage} alt="Icon image"></Image>
            </div>
          </div>
          <div className={`${styles.loginOptions}`}>
            <LoginButton provider="google" iconImage={googleIcon}></LoginButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginOrSignUp;
