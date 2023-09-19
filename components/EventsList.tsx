import React, { FC, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Timer } from './Timer';
import CheckBox from './CheckBox';
import EditIcon from '@/public/IconsSet/edit-05.svg';
import TrashIcon from '@/public/IconsSet/trash-01.svg';
import ImageIcon from '@/public/IconsSet/image-03.svg';
import { ThumbsList } from './ThumbsList';
import { AddEvent, EditModal, Event } from '@/types';
import {
  useDeleteEventMutation,
  usePathEventMutation,
} from '@/redux/api/events.api';
import clsx from 'clsx';
import { DeleteConfirmModal } from '@/components/modal/DeleteConfirmModal';

type EventsListProps = {
  event: Event;
  setEditModal: React.Dispatch<React.SetStateAction<EditModal>>;
};

export const EventsList: FC<EventsListProps> = ({ event, setEditModal }) => {
  const [deleteEvent] = useDeleteEventMutation();
  const [pathEvent] = usePathEventMutation();
  const [isImageBoxActive, setIsImageBoxActive] = useState(false);
  const [isDeleteConfirmShowModal, setIsDeleteConfirmShowModal] =
    useState(false);
  const handleDeleteEvent = async (id: string) => {
    await deleteEvent(id);
  };
  return (
    <div className="flex items-center justify-between gap-4 w-full bg-white">
      <div className="flex gap-4 w-full p-4 justify-between items-center border border-stroke hover:shadow-sm hover:shadow-dark-60 rounded-md shadow-md shadow-dark-60">
        <div className="flex flex-col gap-3 tablet:gap-4 w-full tablet:w-fit laptop:w-full">
          <div className="flex flex-col gap-2">
            <p className="text-dark-100 font-bold text-parL tablet:text-dispS1">
              {event.title}
            </p>
            <p className="text-parS tablet:text-dispS3 overflow-hidden text-dark-80 max-w-[363px] truncate text-ellipsis max-h-[28px]">
              {event.description}
            </p>
          </div>

          <div className="flex items-center gap-2 tablet:gap-4 p-2 w-fit tablet:p-4 border border-stroke rounded-md shadow-inner bg-yellow-10 shadow-dark-60">
            <div
              className={clsx(
                event.deadline !== '1970-01-01T00:00:00.000Z'
                  ? 'w-fit'
                  : 'w-full',
                'p-1  tablet:p-2 border border-stroke rounded-md flex flex-col gap-1 shadow-sm shadow-dark-60 bg-yellow-20',
              )}
            >
              <p className="text-dark-60 tablet:text-parS text-[10px] font-normal">
                Created at:
              </p>
              <div>
                <p className="text-dark-100 text-[10px] tablet:text-parM font-bold">
                  {event.created &&
                    format(parseISO(event.created), 'd MMM yyyy')}
                </p>
                <p className="text-dark-100 text-[10px] tablet:text-parS font-bold">
                  {event.created && format(parseISO(event.created), 'HH:mm:ss')}
                </p>
              </div>
            </div>

            {event.deadline !== '1970-01-01T00:00:00.000Z' ? (
              <div
                className="p-1 tablet:p-2  border border-stroke rounded-md flex flex-col gap-1 shadow-sm shadow-dark-60 bg-yellow-20
            "
              >
                <p className="text-dark-60 tablet:text-parS text-[10px] font-normal">
                  Deadline at:
                </p>
                <div>
                  <p className="text-dark-100 text-[10px] tablet:text-parM font-bold">
                    {event.deadline &&
                      format(parseISO(event.deadline), 'd MMM yyyy')}
                  </p>
                  <p className="text-dark-100 text-[10px] tablet:text-parS font-bold">
                    {event.deadline &&
                      format(parseISO(event.deadline), 'HH:mm:ss')}
                  </p>
                </div>
              </div>
            ) : null}

            {event.deadline ? <Timer deadline={event.deadline} /> : null}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div
                className="p-1 w-[30px] h-[30px] border border-stroke rounded-md flex flex-col gap-1 cursor-pointer hover:bg-yellow-20 hover:shadow-sm hover:shadow-dark-60 shadow-md shadow-dark-60 bg-yellow-10"
                onClick={() => {
                  setEditModal({
                    isOpen: true,
                    data: {
                      title: event.title,
                      description: event.description,
                      deadline: event.deadline,
                    },
                    handleConfirm: async (values: AddEvent) => {
                      try {
                        if (event._id) {
                          await pathEvent({ id: event._id, body: values });
                        }

                        setEditModal((prevState) => ({
                          ...prevState,
                          isOpen: false,
                        }));
                      } catch (error) {}
                    },
                    title: event.title,
                  });
                }}
              >
                <EditIcon className="w-[20px] h-[20px] text-dark-80" />
              </div>

              <div
                className="p-1 border w-[30px] h-[30px] border-stroke rounded-md flex flex-col gap-1 cursor-pointer hover:bg-yellow-20 hover:shadow-sm hover:shadow-dark-60 shadow-md shadow-dark-60 bg-yellow-10"
                onClick={() => {
                  setIsDeleteConfirmShowModal(true);
                }}
              >
                <TrashIcon className="w-[20px] h-[20px] text-dark-80" />
              </div>

              {event._id ? (
                <CheckBox itemId={event._id} variant={'event'} />
              ) : null}
            </div>
            <div
              className={clsx(
                isImageBoxActive
                  ? 'shadow-sm shadow-dark-60 bg-yellow-20 hover:bg-yellow-40'
                  : 'shadow-md shadow-dark-60 bg-yellow-10 hover:bg-yellow-20 hover:shadow-sm hover:shadow-dark-60',
                'p-1 border w-[30px] tablet:hidden h-[30px] border-stroke rounded-md flex flex-col gap-1 cursor-pointer  ',
              )}
              onClick={() => {
                setIsImageBoxActive(!isImageBoxActive);
              }}
            >
              <ImageIcon className="w-[20px] h-[20px] text-dark-80" />
            </div>
          </div>

          <div
            className={clsx(
              isImageBoxActive ? 'block' : 'hidden',
              'tablet:hidden  w-full flex-none',
            )}
          >
            {event._id && event.images && (
              <ThumbsList _id={event._id} images={event.images} />
            )}
          </div>
        </div>
        <div className="hidden tablet:block w-[190px] flex-none">
          {event._id && event.images && (
            <ThumbsList _id={event._id} images={event.images} />
          )}
        </div>
      </div>
      <DeleteConfirmModal
        buttonText={'Delete'}
        titleText={'Delete Event'}
        messageText={'Are you sure you want to delete this event?'}
        showDeleteConfirmModal={isDeleteConfirmShowModal}
        setShowDeleteConfirmModal={setIsDeleteConfirmShowModal}
        Action={async () => {
          await handleDeleteEvent(event._id!);
        }}
      />
    </div>
  );
};
