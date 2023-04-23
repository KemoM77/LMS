import firebase_app from '../../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  QueryFieldFilterConstraint,
  DocumentData,
  limit,
  orderBy,
  or,
  Query,
} from 'firebase/firestore';
import { db } from './getData';
import { QueryConstraint, OrderContraint, LimitConstraint, FeildQueryConstraint } from './constraints';

export default async function getManyDocs(
  collectionName: string,
  constraints: FeildQueryConstraint[] =  [],
  relation: 'And' | 'Or' = 'And',
  orderContraint: OrderContraint = undefined,
  limitTo: number = undefined
) {
    
  let queryConstraints: QueryFieldFilterConstraint[] = [];
  constraints.forEach((con) => {
    if(con.value)
    queryConstraints?.push(where(con.feild, con.comparison, con.value));
  });

  const collectionRef = collection(db, collectionName);

  let finalQuery: Query<DocumentData>;
  if (!orderContraint && !limitTo) {
    console.log(1);
    
    finalQuery =
      relation === 'And' ? query(collectionRef, ...queryConstraints) : query(collectionRef, or(...queryConstraints));
      
  } else if (orderContraint && !limitTo) {
    console.log(2);
    finalQuery =
      relation === 'And'
        ? query(collectionRef, ...queryConstraints, orderBy(orderContraint.feild, orderContraint.method))
        : query(collectionRef, or(...queryConstraints), orderBy(orderContraint.feild, orderContraint.method));
  } else if (!orderContraint && limitTo) {
    console.log(2);
    finalQuery =
      relation === 'And'
        ? query(collectionRef, ...queryConstraints, limit(limitTo))
        : query(collectionRef, or(...queryConstraints), limit(limitTo));
  } else {
    console.log(4);
    finalQuery =
      relation === 'And'
        ? (finalQuery = query(
            collectionRef,
            ...queryConstraints,
            limit(limitTo),
            orderBy(orderContraint.feild, orderContraint.method)
          ))
        : (finalQuery = query(
            collectionRef,
            ...queryConstraints,
            limit(limitTo),
            orderBy(orderContraint.feild, orderContraint.method)
          ));

    finalQuery = query(
      collectionRef,
      or(...queryConstraints),
      limit(limitTo),
      orderBy(orderContraint.feild, orderContraint.method)
    );
  }

  query(collectionRef, ...queryConstraints);

  const querySnapshot = await getDocs(finalQuery)
  console.log('hereeeeee',querySnapshot.docs);

  return { querySnapshot };
}
