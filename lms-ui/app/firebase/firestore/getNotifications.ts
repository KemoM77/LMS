import getManyDocs from './getManyDocs';

export default async function getNotification(uid:string) {

  const { docsCount, querySnapshot } = await getManyDocs(`users/${uid}/notifications`, [], 'And', {
    feild: 'createdAt',
    method: 'desc',
  });
  
  const notifications = querySnapshot.docs
  return { notifications , docsCount };
}
