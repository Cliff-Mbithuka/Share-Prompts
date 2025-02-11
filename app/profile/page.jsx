"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";

const MyProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    if (!session?.user?.id) return; // Avoid running fetch if session is not available

    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/users/${session.user.id}/posts`);
        if (!response.ok) throw new Error("Failed to fetch posts");

        const data = await response.json();
        setMyPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [session?.user?.id]); // Added session dependency

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    if (!confirm("Are you sure you want to delete this Prompt?")) return;

    try {
      await fetch(`/api/prompt/${post._id.toString()}`, { method: "DELETE" });
      setMyPosts((prevPosts) => prevPosts.filter((item) => item._id !== post._id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <Profile
      name="My"
      desc="Welcome to your personalized Profile Page"
      data={myPosts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
