//Especificación de Ruta
const isGitHub = window.location.hostname.includes("github.io");
const repoName = window.location.pathname.split("/")[1];
const urlBase = isGitHub ? `/${repoName}/` : "/";

export const CONFIG = {
  isGitHub: isGitHub,
  repoName: repoName,
  urlBase: urlBase,
  serverUrl: isGitHub ? window.location.origin : "http://localhost:3000",
};
