import { Notification } from '@/app/(authed)/profile/notification';

import addData from './addData';

export default async function ReadNotification(uid: string, notif:Notification) {

    const data : Notification ={
        ...notif,
        isRead:true
    }

  const { result, error } = await addData(`users/${uid}/notifications`, data.id, data);
}
