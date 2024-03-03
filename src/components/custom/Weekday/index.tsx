import { TWeekDayLabel } from "~/constants/types"
import classnames from 'classnames'
import moment, { Moment } from "moment"

import { useState } from "react"
  

type TWeekdayProps = {
    index: number
    month:Moment
    labels:TWeekDayLabel,
    currentDateIsInLastMonth:boolean
}

export default function Weekday({ index,labels, month, currentDateIsInLastMonth }: TWeekdayProps){
    let showSelectedTextBg = false
    const isSameWeekday = moment().day() === index
    const isInSameMonth = month.isSame(moment(),'month')
    
    if (currentDateIsInLastMonth) {
        showSelectedTextBg = isSameWeekday
    } else {
        showSelectedTextBg = isInSameMonth && isSameWeekday
    }

    const className = classnames("flex","items-center","justify-end","py-2","px-4","border-r border-b border-gray-200 font-bold",{
        "border-r-0": index === 6,
        "text-blue-500": showSelectedTextBg
    })
    
    return(
        <>
            <div className={className} >
                <h2 className="text-2xl">
                    {labels.initials}
                </h2>
            </div>
        </>

    )
}