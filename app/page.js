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
  

  let isAdmin = Auth?.user?.signInUserSession?.accessToken?.payload["cognito:groups"]?.includes("Admin") ? true : false

console.log("isAdmin", isAdmin);
  return (
    <main className={styles.main}>
     <div className={styles.hero}>
      <p>Welcome {Auth?.user?.attributes?.name} {isAdmin ? ", you are ADMIN. Show your Magic !! " : ", Let's explore."}</p>
      <Button onClick={handleLogout}>Logout here</Button>
     </div>
     <Blog />

    </main>
  )
}
