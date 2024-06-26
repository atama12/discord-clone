import React,{useState} from 'react'
import { useEffect } from 'react';
import { onSnapshot,collection, query, DocumentData, Query, Timestamp, orderBy} from "firebase/firestore"
import { db } from '../.firebase';
import { useAppSelector } from '../app/hooks';

interface Messages  {
    timestamp:Timestamp;
    message:string;
    user:{
        uid: string,
        photo: string,
        email: string,
        displayName: string;
    };
}

const useSubCollection = (collectionName:string,subCollctionName:string) => {

    const [subdocuments,setSubDocuments] = useState<Messages[]>([]);
    const channelId = useAppSelector((state) => state.channel.channelId)

    
    useEffect(() => {
        let collectionRef = collection(db,collectionName,String(channelId),subCollctionName);
    
        const collectionRefOrderBy = query(collectionRef,orderBy("timestamp","asc"));
    
        onSnapshot(collectionRefOrderBy,(snapshot) =>{
            let results : Messages[] = [];
            snapshot.forEach((doc) => {
                results.push({
                    timestamp:doc.data().timestamp,
                    message:doc.data().message,
                    user: doc.data().user,
                })
            })
            setSubDocuments(results)
        })
      },[channelId])

    return {subdocuments};
}

export default useSubCollection;