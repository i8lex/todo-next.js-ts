import React from 'react';

export type LayoutProps = {
  children: React.ReactNode;
  page: string;
};

export type Images = Image[];

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

export type Tasks = Task[];

export type Task = {
  _id?: string;
  user?: string;
  title: string;
  description: string;
  done?: boolean;
  created?: string;
  __v?: number;
  deadline?: string;
  images?: string[];
};

export type AddTask = {
  title?: string;
  description?: string;
  deadline?: string;
  images?: string[];
};
export type EditModal = {
  isOpen: boolean;
  title: string;
  data: Image | Task | {};
  handleConfirm: (() => void) | (() => Promise<void>);
  handleClose?: () => void;
};

export type DeleteConfirmModal = {
  isOpen: boolean;
  title: string;
  handleConfirm: () => void;
};
