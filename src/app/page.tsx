"use client";

import { signOut } from "next-auth/react";
import Button from "@/components/ui/Button";

export default function Home() {
  return <Button onClick={() => signOut()}>Sign out</Button>;
}
