import React, { useEffect, useRef, useState } from 'react'


export let activeTabLineRef;
export let activeButtonRef;
const InPageNavigation = ({ children, routes, defaultHidden = [], defaulActiveIndex = 0 }) => {

    activeTabLineRef = useRef();
    activeButtonRef = useRef();
    const [indexPageNavIndex, setIndexPageNavIndex] = useState(defaulActiveIndex)

    const changePageState = (btn, i) => {
        let { offsetWidth, offsetLeft } = btn;

        activeTabLineRef.current.style.width = offsetWidth + "px"
        activeTabLineRef.current.style.left = offsetLeft + "px"

        setIndexPageNavIndex(i);
    }

    useEffect(() => {
        changePageState(activeButtonRef.current, defaulActiveIndex)
    }, [])


    return (
        <>

            <div className='relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto'>
                {
                    routes.map((route, i) => {
                        return (
                            <button key={i}
                                ref={i == defaulActiveIndex ? activeButtonRef : null}
                                className={"p-4 px-5 capitalize " +
                                    (indexPageNavIndex == i ? "text-black" : "text-dark-grey ") +
                                    (defaultHidden.includes(route) ? "md:hidden " : " ")
                                }
                                onClick={(e) => changePageState(e.target, i)}
                            >
                                {route}
                            </button>
                        )
                    })
                }

                <hr className='absolute bottom-0 duration-300' ref={activeTabLineRef} />
            </div>

            <div>
                {
                    Array.isArray(children) ? children[indexPageNavIndex] : children
                }
            </div>

        </>
    )
}

export default InPageNavigation