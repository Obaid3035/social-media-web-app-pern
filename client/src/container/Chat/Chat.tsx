import React, { useEffect, useState } from "react";
import { Col, Row } from 'react-bootstrap';
import Conversation from './Conversation/Conversation';
import ChatBox from './ChatBox/ChatBox';
import { getAllConversations } from "../../services/api/conversation";
import { useAppSelector } from "../../services/hook";
import Search from "./Conversation/Search/Search";
import { IUser } from "../../component/Header/Header";
import { Helmet } from "react-helmet";
import { getHelmet } from "../../utils/helmet";


export interface IConversation {
  id: number;
  sender_id: number;
  receiver_id: number;
  latest_message: string,
  created_at: string;
  updated_at: string;
  sender:IUser;
  receiver: IUser,
  unseen_count: number
}

const Chat = () => {
  const [search, setSearch] = useState("");
  const [conversation, setConversation] = useState<IConversation[]>([])
  const [isConversationLoading, setIsConversationLoading] = useState(false)
  const selectedChat = useAppSelector((state) => state.notification.selectedChat);
  useEffect(() => {
    setIsConversationLoading(true)
    getAllConversations(search)
      .then((res) => {
        setIsConversationLoading(false)
        setConversation(res.data)
      })
      .catch(() => {
        setIsConversationLoading(false)
      })
  }, [search])

   return (
     <Row className='px-3'>
       { getHelmet('Chat') }
       <Col md={4}>
         <div className='conversation-container'>
           <Search search={search}
                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}/>
           <Conversation isLoading={isConversationLoading} conversations={conversation}/>
         </div>
       </Col>
       <Col md={8}>
         {
           selectedChat ? <ChatBox selectedChat={selectedChat}/> : (
             <div className={'d-flex justify-content-center align-items-center h-100'}>
               <p className={'text-muted'}>Please select a conversation</p>
             </div>
           )
         }
       </Col>
     </Row>
   );
};
export default Chat;
