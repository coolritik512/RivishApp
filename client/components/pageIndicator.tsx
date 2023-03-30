import React from 'react'

export default function PageIndicator({pagesCount , currentPage , className} : {pagesCount:number , currentPage:number , className:string}) {
    return (
        <ul className={`flex gap-1 justify-end pr-4 ${className}`}>
            {
                Array(pagesCount).fill(0).map((page, index) => {
                    return <li className={`h-[2px] w-3 ${currentPage == index ? 'bg-gray-100' : 'bg-gray-400'}`} key={`${index}`}></li>
                })
            }
        </ul>)
}
