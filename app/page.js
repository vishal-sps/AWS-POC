"use client"
import Image from 'next/image'
import styles from './page.module.css'

import { Auth } from 'aws-amplify';

import { Button } from '@aws-amplify/ui-react';
import Blog from './component/Blog';

export default function Home() {

  const handleLogout = ()=>{
    Auth.signOut().then(() => {
      console.log("log out");
    });
  }

  console.log("user",Auth?.user);
  

  let isAdmin = Auth?.user?.signInUserSession?.accessToken?.payload["cognito:groups"]?.includes("isAdmin") ? true : false


  return (
    <main className={styles.main}>
     <div>
      <p>Welcome {Auth?.user?.attributes?.name} {isAdmin ? ", you are from HOD Group. Show your Magic !! " : ", Let's explore or "}</p>
      <Button onClick={handleLogout}>Logout</Button>
      <Blog />
     </div>
    </main>
  )
}
