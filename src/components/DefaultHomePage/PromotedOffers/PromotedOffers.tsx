import Image from "next/image";
import styles from "./styles.module.scss";
import { userGetSomeRecentlyJoined } from "@/app/api/user/getSomeRecentlyJoined/route";
import Link from "next/link";
import Button from "@/components/UI/Button/Button";
import starImage from "../../../../public/star.svg";
import Select, { Option } from "@/components/UI/Select/Select";

const PromotedOffers = async () => {
  const recentlyJoinedUsersResponse = await userGetSomeRecentlyJoined();

  return (
    <div className={`${styles.promotedOffers}`}>
      <h2 className={`normalText`}>They develop their business the fastest</h2>
      <div className={`${styles.selectElementsWrapper}`}>
        <Select width="auto">
          <Option value="Country" disabled></Option>
          <Option value="Poland"></Option>
          <Option value="Germany"></Option>
          <Option value="France"></Option>
          <Option value="Spain"></Option>
        </Select>
        <Select width="auto">
          <Option value="Voivodeship" disabled></Option>
          <Option value="1"></Option>
          <Option value="2"></Option>
          <Option value="3"></Option>
          <Option value="4"></Option>
        </Select>
        <Select width="auto">
          <Option value="Category" disabled></Option>
          <Option value="1"></Option>
          <Option value="2"></Option>
          <Option value="3"></Option>
          <Option value="4"></Option>
        </Select>
      </div>
      <div className={`${styles.offers}`}>
        {recentlyJoinedUsersResponse.data &&
          recentlyJoinedUsersResponse.data.map((data) => {
            const { profileImage, publicId, averageOpinion, description, _count } = data;

            return (
              <div className={`${styles.offer}`}>
                <div className={`${styles.userData}`}>
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
                <div className={`${styles.offerData}`}>
                  <h3>Szukam osób do pisania tesktów pod SEO z różnych branż</h3>
                  <p className={`normalText ${styles.description}`}>
                    Cześć, zlecę przygotowanie opisów i blogów dla klientów z branż: - IT - ubezpieczenia - FMCG (restauracja) - biżuteria Szukam 1, 2 lub 3
                    osób (w zależności od wiedzy i doświadczenia w tych branżach). Planuję długofalową współpracę i zlecenia: - 12 tys. zzs/msc dla branży IT
                    (outsourcing IT) - od już - 40 tys. zzs/msc dla branży ubezpieczeń (sprzedaż ubezpieczeń) - w marcu 30tys. - 24 tys. zzs/msc dla branży
                    spożywczej (pizzeria) - od już - 10 tys. zzs/msc dla sklepu z biżuterią - od kwietnia Proszę o podanie stawki za 1000 zzs oraz określenie
                    dla której branży możesz pisać. Jeśli posiadasz portfolio z tekstami dla tych branż lub pokrewnych - wyślij koniecznie, biorę je pod uwagę w
                    pierwszej kolejności. :) Teksty zlecam z 3 tygodniowym wyprzedzeniem (w marcu będę potrzebować tekstów szybciej - za ok tydzień). Podajemy
                    frazy kluczowe do użycia w tekście.
                  </p>
                  <p className={`${styles.location}`}>Poland, Warszawa</p>
                  <p className={`${styles.usedTimes}`}>Used 1252 times</p>
                  <div className={`${styles.categories}`}>
                    <p>qwqwqw</p>
                    <p>qwqwqw</p>
                    <p>qwqwqw</p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PromotedOffers;
