// use client 를 사용하지 않아도 되지만 경계의 구분을 위해 use client 사용
"use client";

import { CreateWorkspaceModal } from "@/features/workspace/components/create-workspace-modal";
import { useEffect, useState } from "react";

export const Modals = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isMounted === false) return null;

  return (
    <>
      <CreateWorkspaceModal />
    </>
  );
};
