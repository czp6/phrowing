import { onRequestPost as __api_auth_login_js_onRequestPost } from "/Users/Charlie/Documents/VSCODE2026/rowing_website/functions/api/auth/login.js"
import { onRequestPost as __api_auth_register_js_onRequestPost } from "/Users/Charlie/Documents/VSCODE2026/rowing_website/functions/api/auth/register.js"
import { onRequestGet as __api_auth_user_js_onRequestGet } from "/Users/Charlie/Documents/VSCODE2026/rowing_website/functions/api/auth/user.js"
import { onRequestGet as __api_leaderboard_js_onRequestGet } from "/Users/Charlie/Documents/VSCODE2026/rowing_website/functions/api/leaderboard.js"
import { onRequestPost as __api_leaderboard_js_onRequestPost } from "/Users/Charlie/Documents/VSCODE2026/rowing_website/functions/api/leaderboard.js"
import { onRequestGet as __api_strength_js_onRequestGet } from "/Users/Charlie/Documents/VSCODE2026/rowing_website/functions/api/strength.js"
import { onRequestPost as __api_strength_js_onRequestPost } from "/Users/Charlie/Documents/VSCODE2026/rowing_website/functions/api/strength.js"
import { onRequestGet as __api_submit_js_onRequestGet } from "/Users/Charlie/Documents/VSCODE2026/rowing_website/functions/api/submit.js"
import { onRequestPost as __api_submit_js_onRequestPost } from "/Users/Charlie/Documents/VSCODE2026/rowing_website/functions/api/submit.js"
import { onRequestGet as __api_training_js_onRequestGet } from "/Users/Charlie/Documents/VSCODE2026/rowing_website/functions/api/training.js"
import { onRequestPost as __api_training_js_onRequestPost } from "/Users/Charlie/Documents/VSCODE2026/rowing_website/functions/api/training.js"
import { onRequestPut as __api_training_js_onRequestPut } from "/Users/Charlie/Documents/VSCODE2026/rowing_website/functions/api/training.js"
import { onRequestGet as __api_training_all_js_onRequestGet } from "/Users/Charlie/Documents/VSCODE2026/rowing_website/functions/api/training-all.js"

export const routes = [
    {
      routePath: "/api/auth/login",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_login_js_onRequestPost],
    },
  {
      routePath: "/api/auth/register",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_register_js_onRequestPost],
    },
  {
      routePath: "/api/auth/user",
      mountPath: "/api/auth",
      method: "GET",
      middlewares: [],
      modules: [__api_auth_user_js_onRequestGet],
    },
  {
      routePath: "/api/leaderboard",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_leaderboard_js_onRequestGet],
    },
  {
      routePath: "/api/leaderboard",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_leaderboard_js_onRequestPost],
    },
  {
      routePath: "/api/strength",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_strength_js_onRequestGet],
    },
  {
      routePath: "/api/strength",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_strength_js_onRequestPost],
    },
  {
      routePath: "/api/submit",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_submit_js_onRequestGet],
    },
  {
      routePath: "/api/submit",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_submit_js_onRequestPost],
    },
  {
      routePath: "/api/training",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_training_js_onRequestGet],
    },
  {
      routePath: "/api/training",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_training_js_onRequestPost],
    },
  {
      routePath: "/api/training",
      mountPath: "/api",
      method: "PUT",
      middlewares: [],
      modules: [__api_training_js_onRequestPut],
    },
  {
      routePath: "/api/training-all",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_training_all_js_onRequestGet],
    },
  ]