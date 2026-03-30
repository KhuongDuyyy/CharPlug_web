"use client";

import { useMemo, useSyncExternalStore } from "react";

const QUERY_PARAMS_CHANGE_EVENT = "charplug-query-params-change";
let historyPatched = false;

function patchHistoryEvents() {
  if (historyPatched || typeof window === "undefined") {
    return;
  }

  historyPatched = true;

  const dispatchChange = () => {
    window.dispatchEvent(new Event(QUERY_PARAMS_CHANGE_EVENT));
  };

  const originalPushState = window.history.pushState.bind(window.history);
  const originalReplaceState = window.history.replaceState.bind(window.history);

  window.history.pushState = ((...args) => {
    const result = originalPushState(...args);
    dispatchChange();
    return result;
  }) as History["pushState"];

  window.history.replaceState = ((...args) => {
    const result = originalReplaceState(...args);
    dispatchChange();
    return result;
  }) as History["replaceState"];
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  patchHistoryEvents();

  const handler = () => onStoreChange();
  window.addEventListener("popstate", handler);
  window.addEventListener(QUERY_PARAMS_CHANGE_EVENT, handler);

  return () => {
    window.removeEventListener("popstate", handler);
    window.removeEventListener(QUERY_PARAMS_CHANGE_EVENT, handler);
  };
}

function getSnapshot() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.search;
}

export function useQueryParams() {
  const search = useSyncExternalStore(subscribe, getSnapshot, () => "");
  return useMemo(() => new URLSearchParams(search), [search]);
}
