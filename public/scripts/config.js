const isGitHub = window.location.hostname.includes("github.io");

const repoName = window.location.pathname.split("/")[1];

const urlBase = isGitHub
  ? `/${repoName}/`
  : "/";

export const CONFIG = {
  isGitHub,
  repoName,
  urlBase,
  serverUrl: window.location.origin,
};