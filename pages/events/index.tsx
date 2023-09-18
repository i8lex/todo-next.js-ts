import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import { Input } from '@/components/Input';
import ArrowUpIcon from '@/public/IconsSet/chevron-up.svg';
import ArrowDownIcon from '@/public/IconsSet/chevron-down.svg';

import {
  useGetEventsQuery,
  useAddEventMutation,
  useDeleteEventMutation,
} from '@/redux/api/events.api';
import { ModalDeleteConfirm } from '@/components/ModalDeleteConfirm';
import { form } from '@/constants/form';
import { ModalEditProject } from '@/components/ModalEditProject';
import { EventsList } from '@/components/EventsList';
import { clearEvents } from '@/redux/slices/events.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { DeleteConfirmModal, EditModal, Event } from '@/types';
import { GeneralLayout } from '@/components/layouts/General/Layout';
import { Button } from '@/components/ui/Button';
import clsx from 'clsx';

const EventsPage = () => {
  const { data: events = [], isLoading } = useGetEventsQuery();
  const [addEvent] = useAddEventMutation();
  const [deleteEvent] = useDeleteEventMutation();
  const [isCreateShowing, setCreateShowing] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] =
    useState<DeleteConfirmModal>({
      isOpen: false,
      title: '',
      handleConfirm: () => {},
    });
  const [editModal, setEditModal] = useState<EditModal>({
    isOpen: false,
    title: '',
    data: {},
    handleConfirm: () => {},
  });

  const dispatch = useAppDispatch();
  const { events: checkedEvents } = useAppSelector((state) => state.events);

  if (isLoading) {
    return <h1>...LOADING...</h1>;
  }

  return (
    <GeneralLayout currentPage={'events'}>
      <div className="flex flex-col gap-8 h-[88vh] laptop:flex-row tablet:gap-6 justify-start tablet:justify-between">
        <Formik
          initialValues={{
            title: '',
            description: '',
            done: false,
          }}
          onSubmit={async (values, formikHelpers) => {
            await addEvent(values).unwrap();

            formikHelpers.resetForm();
          }}
          validationSchema={form.projectsValidationSchema}
        >
          <Form className="flex flex-col gap-4 tablet:gap-6 w-full laptop:w-fit">
            <div className="flex items-center w-full laptop:w-[390px]  justify-between text-dispS2 text-dark-100 tablet:text-dispL font-bold">
              <p className="text-parL tablet:text-dispS1 text-dark-100">
                Create project
              </p>
              {checkedEvents.length ? (
                <Button
                  variant="whitered"
                  size={'xs'}
                  className="h-[28px] p-2 shadow-md shadow-dark-60 hover:shadow-sm hover:shadow-dark-60"
                  text={'Delete checked'}
                  type="button"
                  onClick={() =>
                    setDeleteConfirmModal((prevState: any) => ({
                      ...prevState,
                      isOpen: true,
                      handleConfirm: async () => {
                        await deleteEvent(checkedEvents);
                        dispatch(clearEvents());
                      },
                    }))
                  }
                />
              ) : null}
              <div
                onClick={() => {
                  setCreateShowing(!isCreateShowing);
                }}
                className={clsx(
                  isCreateShowing
                    ? 'bg-yellow-20 shadow-sm hover:shadow-md hover:bg-yellow-10'
                    : 'bg-yellow-10 shadow-md hover:shadow-sm hover:bg-yellow-20',
                  'flex flex-col cursor-pointer items-center shadow-dark-60 hover:shadow-dark-60 rounded-md justify-center w-[30px] h-[30px] p-1',
                )}
              >
                {isCreateShowing ? (
                  <ArrowUpIcon className="w-[20px] h-[20px]" />
                ) : (
                  <ArrowDownIcon className="w-[20px] h-[20px]" />
                )}
              </div>
            </div>
            <div
              className={clsx(
                isCreateShowing ? 'flex' : 'hidden',
                ' flex-col gap-4 tablet:gap-6',
              )}
            >
              <Input
                name="title"
                label="Title"
                required={true}
                id="createTaskTitle"
                as="input"
                type="text"
                step={1}
              />
              <Input
                name="description"
                as="textarea"
                label="Description"
                required={false}
                id="createTaskDescription"
                type="text"
                step={1}
              />
              <Button
                className="w-full laptop:w-[390px] tablet:w-[290px]"
                text={'Create'}
                type="submit"
              />
            </div>
          </Form>
        </Formik>

        <div className="flex flex-col w-full bg-softGreen shadow-inner shadow-dark-60 overflow-y-scroll gap-4 h-full max-h-screen mb-4 tablet:mb-6 tablet:gap-6 p-4 tablet:p-6 border border-stroke rounded-md">
          {events.map((event) => {
            return (
              <EventsList
                key={event._id}
                event={event}
                setDeleteConfirmModal={setDeleteConfirmModal}
                setEditModal={setEditModal}
              />
            );
          })}
        </div>
      </div>
      <ModalDeleteConfirm
        isOpen={deleteConfirmModal.isOpen}
        title={deleteConfirmModal.title}
        handleClose={() => {
          setDeleteConfirmModal((prevState) => {
            return {
              ...prevState,
              isOpen: false,
            };
          });
        }}
        handleConfirm={deleteConfirmModal.handleConfirm}
      />
      <ModalEditProject
        isOpen={editModal.isOpen}
        title={editModal.title}
        data={editModal.data as Event}
        handleClose={() => {
          setEditModal((prevState) => ({ ...prevState, isOpen: false }));
        }}
        handleConfirm={editModal.handleConfirm}
      />
    </GeneralLayout>
  );
};

export default EventsPage;
