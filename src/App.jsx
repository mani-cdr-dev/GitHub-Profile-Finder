import { useState } from "react";
import IntroPage from "./components/IntroPage";
import HomePage from "./components/HomePage";
import ProfilePage from "./components/ProfilePage";

export default function App() {
  const [page,setPage] = useState("home");
  const [username,setUsername] = useState("");

  function goToProfile(name){
    setUsername(name);
    setPage("profile");
  }
  function goHome(){
    setPage("home");
  }

  return (
    <>
      <IntroPage />
      {page === "home" && (
        <HomePage onSearch = {goToProfile} />
      )}
      {page === "profile" && (
        <ProfilePage username={username} onBack={goHome} />
      )}
    </>
  );
}