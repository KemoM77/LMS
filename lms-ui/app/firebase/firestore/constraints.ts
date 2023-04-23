import { limit } from 'firebase/firestore';
export type FeildQueryConstraint = {
    feild:string,
    comparison: '=='|'<='|'>='|'!='|'>='| 'array-contains' | 'array-contains-any' | 'in' | 'not-in',
    value : any
} ;


export type OrderContraint = {
    feild:string,
    method:"desc" | "asc"
};


export type LimitConstraint = number;

export type QueryConstraint = FeildQueryConstraint|OrderContraint|LimitConstraint;

