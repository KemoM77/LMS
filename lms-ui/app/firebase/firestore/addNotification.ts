import { Notification } from '@/app/(authed)/profile/notification';
import addData from './addData';
import { faker } from '@faker-js/faker';
import { serverTimestamp } from 'firebase/firestore';

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
