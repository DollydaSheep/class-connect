import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";


export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  
  useEffect(()=> {

    const unsubcribe = onAuthStateChanged(auth, async (user) => {
      if(user){
        try{
          const userDoc = await getDoc(doc(db, "User", user.uid));
          if(userDoc.exists()){
            const userData = userDoc.data();
            setRole(userData.role || "student");
          } else {
            setRole("student");
          }
        } catch(err) {
          console.error("Error fetching user: ", err);
        }
      } else {
        setRole(null);
      }
    })

    return () => unsubcribe();
  },[]);

  return { role };
}