import {
    collection, collectionGroup, DocumentData, getCountFromServer, getDocs, limit, or, orderBy,
    query, Query, QueryFieldFilterConstraint, startAfter, where
} from 'firebase/firestore';

import { FeildQueryConstraint, OrderContraint } from './constraints';
import { db } from './getData';

  export default async function getCollectionGroup(
    collectionName: string,
    constraints: FeildQueryConstraint[] = [],
    relation: 'And' | 'Or' = 'And',
    orderContraint: OrderContraint = undefined,
    limitTo: number = undefined,
    startafter: any = ''
  ) {
    let queryConstraints: QueryFieldFilterConstraint[] = [];
    constraints.forEach((con) => {
      //////console.log(con);
      if (con.value !== undefined && con.value !== null) queryConstraints?.push(where(con.feild, con.comparison, con.value));
    });
  
    const collectionRef = collectionGroup(db, collectionName);
  
    let finalQuery: Query<DocumentData>;
    if (!orderContraint && !limitTo) {
      finalQuery =
        relation === 'And' ? query(collectionRef, ...queryConstraints) : query(collectionRef, or(...queryConstraints));
    } else if (orderContraint && !limitTo) {
      finalQuery =
        relation === 'And'
          ? query(collectionRef, ...queryConstraints, orderBy(orderContraint.feild, orderContraint.method))
          : query(collectionRef, or(...queryConstraints), orderBy(orderContraint.feild, orderContraint.method));
    } else if (!orderContraint && limitTo) {
      finalQuery =
        relation === 'And'
          ? query(collectionRef, ...queryConstraints, limit(limitTo))
          : query(collectionRef, or(...queryConstraints), limit(limitTo));
    } else {
      finalQuery =
        relation === 'And'
          ? (finalQuery = query(
              collectionRef,
              ...queryConstraints,
              limit(limitTo),
              orderBy(orderContraint.feild, orderContraint.method),
              startAfter(startafter)
            ))
          : (finalQuery = query(
              collectionRef,
              ...queryConstraints,
              limit(limitTo),
              orderBy(orderContraint.feild, orderContraint.method),
              startAfter(startafter)
            ));
    }
  
      // finalQuery = query(
      //   collectionRef,
      //   or(...queryConstraints),
      //   limit(limitTo),
      //   orderBy(orderContraint.feild, orderContraint.method)
      // );
     //const tempQ = query(collectionRef, limit(10), orderBy('requestedAt'))
    const querySnapshot = await getDocs(finalQuery);
    ////////console.log('hereeeeee', querySnapshot.docs);
  // Inside getManyDocs function, before the return statement
  let countError = null;
  let docsCount = 0;
  
  try {
    const Count = await getCountFromServer(query(collectionRef, ...queryConstraints));
    docsCount = Count.data().count;
  } catch (e) {
    countError = e;
  }
  
  return { querySnapshot, docsCount, countError };
  
  }
  