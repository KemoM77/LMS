import { serverTimestamp } from 'firebase/firestore';

import { Notification } from '@/app/(authed)/profile/notification';
import { faker } from '@faker-js/faker';

import addData from './addData';

export default async function addNotification(uid: string, title:string , content:string) {

    const data : Notification ={
        id:faker.database.mongodbObjectId()+uid+title,
        createdAt:serverTimestamp(),
        content:content,
        title:title,
        isRead:false
    }

  const { result, error } = await addData(`users/${uid}/notifications`, data.id, data);
}
