import { NextMiddleware } from "next/server";

export type TWeekDayLabel = {
    initials: string,
    name: string
}

export type TNavConfig = {
    iconName:string,
    label: string,
    link: string
}

export type TMiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;