
import { signOut } from "@/contexts/AuthContext";
import { AuthTokenError } from "@/errors/AuthTokenError";
import axios, { AxiosError } from "axios"
import { parseCookies, setCookie } from "nookies"

let isRefreshing = false;
let failedRequestQueue: any[] = [];

export function setupAPIClient(ctx = undefined) {

  let cookies = parseCookies(ctx);
  const api = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      Authorization: `Bearer ${cookies['products-challenge.token']}`
    }
  })

  api.interceptors.response.use(response => {
    return response
  }, (error) => {
    console.log(error)
    if (error?.response?.status === 401) {
      if (error.response.data?.message == "ERR_INVALID_TOKEN") {

        cookies = parseCookies(ctx);

        const { "products-challenge.refreshToken": refreshToken } = cookies;
        const originalConfig = error.config;

        if (!isRefreshing) {
          isRefreshing = true;

          api.post("refresh-token", {
            token: refreshToken
          }).then(response => {
            const { token, refresh_token } = response.data

            setCookie(ctx, "products-challenge.token", token, {
              maxAge: 60 * 60 * 24 * 30, // 30 days
              path: "/"
            });

            setCookie(ctx, "products-challenge.refreshToken", refresh_token, {
              maxAge: 60 * 60 * 24 * 30, // 30 days
              path: "/"
            });

            api.defaults.headers['Authorization'] = `Bearer ${token}`

            failedRequestQueue.forEach(request => request.onSuccess(token))
            failedRequestQueue = []
          }).catch(error => {
            failedRequestQueue.forEach(request => request.onFailure(error))
            failedRequestQueue = []

            if (typeof window) {
              signOut();
            }

          }).finally(() => {
            isRefreshing = false;
          })
        }

        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers["Authorization"] = `Bearer ${token}`

              resolve(api(originalConfig));
            },
            onFailure: (error: AxiosError) => {
              reject(error);
            }
          })
        })
      } else {

        if (typeof window) {
          signOut();
        } else {
          return Promise.reject(new AuthTokenError())
        }
      }
    }
    return Promise.reject(error);
  });

  return api
}