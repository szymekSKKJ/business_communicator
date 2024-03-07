export type message = {
  id: string;
  senderUserId: string;
  content: string;
  sentAt: Date;
};

export type lastMessage = {
  id: string;
  publicId: string;
  profileImage: string;
  lastActive: string;
  sentToUserId: string;
  senderUserId: string;
  content: string;
  sentAt: Date;
};
