export type user = {
  publicId: string | null;
  id: string;
  email: string | null;
  description: string | null;
  profileImage: string;
  backgroundImage: string | null;
  name: string;
  averageOpinion: null | number;
  doesCurrentUserFollowThisUser: boolean | null;
  lastActive: Date;
  _count: {
    following: number;
    followers: number;
    Opinions: number;
  };
};

export type userSmallData = {
  id: string;
  publicId: string;
  profileImage: string;
  lastActive: Date;
};
