import { UserDTO } from '@/redux/api/user.api';

export const onSubmitUpdateUserFormUtil = (
  values: UserDTO,
  infoData: UserDTO,
  avatar: { buffer: string; filename: string; mimetype: string },
) => {
  const data: UserDTO = {};
  const formData = new FormData();
  if (values.firstname !== infoData?.firstname) {
    data.firstname = values.firstname;
    formData.append('firstname', values?.firstname!);
  }
  if (values.lastname !== infoData?.lastname) {
    data.lastname = values.lastname;
    formData.append('lastname', values?.lastname!);
  }
  if (values.birthday !== infoData?.birthday) {
    data.birthday = values.birthday;
    formData.append('birthday', values?.birthday!);
  }
  if (values.isBirthdayShowing !== infoData?.isBirthdayShowing) {
    data.isBirthdayShowing = values.isBirthdayShowing;
    formData.append('isBirthdayShowing', values?.isBirthdayShowing!);
  }
  if (values.gender !== infoData?.gender) {
    data.gender = values.gender;
    formData.append('gender', values?.gender!);
  }
  if (values.isGenderShowing !== infoData?.isGenderShowing) {
    data.isGenderShowing = values.isGenderShowing;
    formData.append('isGenderShowing', values?.isGenderShowing!);
  }
  if (values.company !== infoData?.company) {
    data.company = values.company;
    formData.append('company', values?.company!);
  }
  if (values.isCompanyShowing !== infoData?.isCompanyShowing) {
    data.isCompanyShowing = values.isCompanyShowing;
    formData.append('isCompanyShowing', values?.isCompanyShowing!);
  }
  if (values.role !== infoData?.role) {
    data.role = values.role;
    formData.append('role', values?.role!);
  }
  if (values.isRoleShowing !== infoData?.isRoleShowing) {
    data.isRoleShowing = values.isRoleShowing;
    formData.append('isRoleShowing', values?.isRoleShowing!);
  }
  if (values.about !== infoData?.about) {
    data.about = values.about;
    formData.append('about', values?.about!);
  }
  if (values.isAboutShowing !== infoData?.isAboutShowing) {
    data.isAboutShowing = values.isAboutShowing;
    formData.append('isAboutShowing', values?.isAboutShowing!);
  }
  if (values.isConnectsShowing !== infoData?.isConnectsShowing) {
    data.isConnectsShowing = values.isConnectsShowing;
    formData.append('isConnectsShowing', values?.isConnectsShowing!);
  }
  if (values.isEventsShowing !== infoData?.isEventsShowing) {
    data.isEventsShowing = values.isEventsShowing;
    formData.append('isEventsShowing', values?.isEventsShowing!);
  }
  if (avatar.mimetype && avatar.buffer !== values.avatar?.buffer) {
    data.avatar = {
      name: avatar.filename,
      buffer: avatar.buffer,
      mimeType: avatar.mimetype,
    };
    const newBlob = new Blob([avatar.buffer], {
      type: avatar.mimetype,
    });
    const file = new File([newBlob], avatar.filename, {
      type: avatar.mimetype,
    });
    formData.append('image', file);
  }

  if (
    formData.has('firstname') ||
    formData.has('lastname') ||
    formData.has('birthday') ||
    formData.has('isBirthdayShowing') ||
    formData.has('gender') ||
    formData.has('isGenderShowing') ||
    formData.has('role') ||
    formData.has('isRoleShowing') ||
    formData.has('about') ||
    formData.has('isAboutShowing') ||
    formData.has('company') ||
    formData.has('isCompanyShowing') ||
    formData.has('image') ||
    formData.has('isConnectsShowing') ||
    formData.has('isEventsShowing')
  ) {
    return {
      isNoEmpty: true,
      formData,
    };
  } else {
    return {
      isNoEmpty: false,
    };
  }
};
