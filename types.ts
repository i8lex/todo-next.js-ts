import React from 'react';

export type LayoutProps = {
  id?: string;
  children: React.ReactNode;
  page: string;
};

export type Page = 'events' | 'about' | 'contact' | 'my' | 'users';

export type Image = {
  _id: string;
  user: string;
  task: string;
  image: string;
  filename: string;
  mimetype: string;
  thumb: string;
  thumbPath: string;
  created_at: string;
  __v: number;
};

export type AuthState = {
  auth: {
    token: string;
  };
};

export type Events = Event[];

export type Event = {
  _id?: string;
  user?: string;
  title: string;
  description?: string;
  done?: boolean;
  created?: string;
  __v?: number;
  deadline?: string | Date;
  images?: string[];
};

export type AddEvent = {
  title?: string;
  description?: string;
  deadline?: string | Date;
  images?: string[];
};
export type EditModal = {
  isOpen: boolean;
  title: string;
  data: Image | Event | {};
  handleConfirm:
    | ((values: AddEvent) => void)
    | ((values: AddEvent) => Promise<void>);
  handleClose?: () => void;
};

export type DeleteConfirmModalTypes = {
  isOpen: boolean;
  title: string;
  handleConfirm: () => void;
};

export type Message = {
  _id: string;
  user: string;
  username: string;
  message: string;
  created_at: string;
  readBy: string[];
  // __v: number;
};

export type Chat = {
  _id?: string;
  user: string;
  users: string[];
  messages: Message[];
};
