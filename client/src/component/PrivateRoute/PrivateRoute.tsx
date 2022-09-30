import React, { useEffect } from "react";
import { errorNotify } from '../../utils/toast';
import { Navigate, useNavigate } from 'react-router-dom';
import jwt from 'jwt-decode';
import { getCurrentUser, getToken, removeToken } from '../../utils/helper';
import axios from 'axios';
import { USER_ROLE } from '../../App';
import { IMessage } from '../../container/Chat/ChatBox/ChatBox';
import { useAppDispatch, useAppSelector } from '../../services/hook';
import { setChatNotification, setNotification } from '../../services/slices/notification';

import { INotification } from "../Header/Header";

interface IPrivateRouteProps {
    children: JSX.Element;
    role: string;
}

const PrivateRoute: React.FC<IPrivateRouteProps> = ({ children, role }) => {
    const token = getToken()
    const navigate = useNavigate()
    const selectedChat = useAppSelector((state) => state.notification.selectedChat);
    const socket = useAppSelector((state) => state.notification.socket);
    const chatNotification = useAppSelector((state) => state.notification.chatNotification);
    const notification = useAppSelector((state) => state.notification.notification)
    const notificationCount = useAppSelector((state) => state.notification.notificationCount)
    const dispatch = useAppDispatch();

    if (!token) {
        errorNotify("You are not authorize")
        return <Navigate to={'/'} />
    }

    const decode: { user: any } = jwt(token);

    if (!decode.user) {
        removeToken();
        errorNotify("You are not authorize")
        return <Navigate to={'/'} />
    }

    if (decode.user && decode.user.role !== role) {
        if (decode.user.role === USER_ROLE.ADMIN) {
            errorNotify("You are not authorize")
            return <Navigate to={'/admin/blogs'} />
        } else if (decode.user.role === USER_ROLE.USER) {
            errorNotify("You are not authorize")
            return <Navigate to={'/home'} />
        }
    }

    useEffect(() => {
        socket.emit('setup', getCurrentUser());
        socket.on('connected', () => console.log("Socket connected"));
    }, []);

    useEffect(() => {
        socket.on("message received", (newMessageReceived: IMessage) => {
           if (!selectedChat) {
               dispatch(setChatNotification(
                 {
                     conversation: chatNotification.conversation.map((conversation) => {
                         if (conversation.id == newMessageReceived.conversation_id) {
                             return {
                                 ...conversation,
                                 updated_at: newMessageReceived.conversation.updated_at,
                                 latest_message: newMessageReceived.content,
                                 unseen_count: conversation.unseen_count + 1
                             }
                         }
                         return conversation
                     }),
                     allUnseenMessages: chatNotification.allUnseenMessages + 1
                 }
               ))
           }
        })
    }, [chatNotification])

    useEffect(() => {
        console.log("RENDER")
        const handler = (sentNotification: INotification) => {
            const notificationClone = [
                ...notification,
                {

                },
            ]
            if (notificationClone.length > 3) {
                notificationClone.pop()
            }

            dispatch(setNotification({
                notification: [
                  ...notification,
                    {
                        ...sentNotification
                    },
                ],
                notificationCount: notificationCount + 1
            }))
        }
        socket.on("notification received", handler)
    }, [notificationCount > 0])


   useEffect(() => {
       axios.get(`/auth/authorize/${token}`)
         .catch((err) => {
             if (err) {
                 removeToken();
                 errorNotify("You are not authorize")
                 navigate("/")
             }
         })
   }, [])
    return children
};

export default PrivateRoute;
