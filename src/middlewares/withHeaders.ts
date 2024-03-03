// middlewares/withHeaders.ts
import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
import { TMiddlewareFactory } from "~/constants/types";
export const withHeaders: TMiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const res = await next(request, _next);
    if (res) {
      res.headers.set("x-pathname", request.nextUrl.pathname);
    }
    return res;
  };
};
