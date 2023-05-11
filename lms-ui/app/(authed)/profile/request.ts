
export type RequestStatus = 'ACCEPTED' | 'PENDING' | 'REJECTED' | 'CANCELED' | 'RETURNED';
export type Operation = 'BORROW' | 'BUY'

export interface BookRequest {
    id:string,
    bookName:string,
    userName?:string
    uid:string,
    bookId:string,
    requestedAt:any,
    until?:any,
    type:Operation,
    status:RequestStatus,
    managedBy?:string,
    managedAt?:any
}