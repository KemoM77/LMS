import {
    collection, DocumentData, getCountFromServer, getDocs, limit, orderBy, query, Query,
    startAfter, 
} from 'firebase/firestore';

import {
    FeildQueryConstraint, LimitConstraint, OrderContraint, QueryConstraint
} from './constraints';
import { db } from './getData';

  export default async function getPaginatedDocs(
    collectionName: string,
    startat:any,
    endat:number,
    orderConstraint: OrderContraint = {feild:'id',method:'desc'},
    ) {
    
    const collectionRef = collection(db, collectionName);
  
    let finalQuery: Query<DocumentData> = query(collectionRef, orderBy( orderConstraint.feild ,orderConstraint.method),startAfter(startat) ,limit(endat) );
  
    const querySnapshot = await getDocs(finalQuery);
    
    return {querySnapshot };
  }

  export async function getQueryCount(collectionName:string)
  {
    const coll = collection(db, collectionName);
    const snapshotOfCount = await getCountFromServer(coll);
    const count = snapshotOfCount.data().count;
    return {count}
  }