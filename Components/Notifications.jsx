import { UserContext } from '@/app/layout'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { FilterPaginationData } from './FilterPaginationData'
import Loader from './Loader'

import { fadeIn } from '@/Common/Animate'
import { motion } from 'framer-motion';
import NoDataFound from './NoDataFound'
import NotificationCard from './NotificationCard'
import LoadMore from './LoadMore'

const Notifications = () => {
    const [filter, setFilter] = useState('all')
    const [notifications, setNotifications] = useState(null)
    let filters = ['all', 'like', 'comment', 'reply']

    const { userAuth, userAuth: { token, new_notification_available }, setUserAuth } = useContext(UserContext)

    const handleFilter = (e) => {
        let btn = e.target;

        setFilter(btn.innerHTML)
        setNotifications(null)
    }

    const fetchNotifications = ({ page, deletedDocCount = 0 }) => {
        axios.post(process.env.NEXT_PUBLIC_URL + "/api/notificationsGet", { page, filter, deletedDocCount }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(async ({ data: { data: { notifications: data } } }) => {

            if (new_notification_available) {
                setUserAuth({ ...userAuth, new_notification_available: false })
                storeInSession(new_notification_available, false)

            }

            let formatedData = await FilterPaginationData({
                state: notifications,
                data1: data,
                page,
                countRoute: '/api/notificationsAllAcount',
                data_to_send: { filter },
                user: token
            })

            setNotifications(formatedData)
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {

        if (token) {
            fetchNotifications({ page: 1 })
        }

    }, [token, filter])


    return (
        <div>
            <h1 className='max-md:hidden'>Recent Notifications</h1>

            <div className='my-8 flex gap-8 max-md:gap-4 flex-wrap'>
                {
                    filters?.map((filtername, i) => {
                        return <button key={i} className={'py-2  ' + (filter == filtername ? 'btn-dark' : 'btn-light')}
                            onClick={handleFilter}
                        >
                            {filtername}
                        </button>
                    })
                }

            </div>


            {
                notifications == null ? <Loader /> :
                    <>
                        {
                            notifications?.results?.length ?

                                notifications?.results?.map((notification, i) => {
                                    return <motion.div
                                        variants={fadeIn(0.2, 0.2 * i)}
                                        initial='hidden'
                                        animate='show'
                                        exit='hidden'
                                        key={i}
                                    >
                                        <NotificationCard data={notification} index={i} notificationState={{ notifications, setNotifications }} />
                                    </motion.div>
                                }) :
                                <NoDataFound message={'Notification not avialable'} />
                        }
                        <LoadMore state={notifications} fetchDataFunc={fetchNotifications} additionalParam={{ deletedDocCount: notifications.deletedDocCount }} />
                    </>
            }

        </div>
    )
}

export default Notifications