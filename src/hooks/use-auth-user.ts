"use client";

import {
  useMemo,
  useSyncExternalStore,
} from "react";

import {
  getAccessToken,
  getAuthenticatedUser,
} from "@/services/auth-service";

import type {
  AuthUser,
} from "@/types/auth";

function subscribe(
  callback: () => void,
) {
  window.addEventListener(
    "usus-auth-change",
    callback,
  );

  window.addEventListener(
    "storage",
    callback,
  );

  return () => {
    window.removeEventListener(
      "usus-auth-change",
      callback,
    );

    window.removeEventListener(
      "storage",
      callback,
    );
  };
}

function getSnapshot() {
  return getAccessToken();
}

function getServerSnapshot() {
  return null;
}

export function useAuthUser():
  | AuthUser
  | null {
  const token =
    useSyncExternalStore(
      subscribe,
      getSnapshot,
      getServerSnapshot,
    );

  return useMemo(() => {
    if (!token) {
      return null;
    }

    return getAuthenticatedUser();
  }, [token]);
};