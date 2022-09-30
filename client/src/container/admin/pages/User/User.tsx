import React, { useEffect, useState } from "react";
import Loader from "../../../../component/Loader/Loader";
import { AiOutlineIssuesClose } from "react-icons/ai"
import { getAllUsers, getNotVerifiedUser, getVerifiedUser, toVerified } from "../../../../services/api/admin/user";
import { GoVerified } from "react-icons/go"
import { ImCross } from "react-icons/im"
import "../Blog/Blog.scss"
import { Tab, Tabs } from "react-bootstrap";
import MuiDataTable from "../../../../component/MuiDataTable/MuiDataTable";
import { successNotify } from "../../../../utils/toast";

enum TABS {
  ALL = "all",
  VERIFIED = "verified",
  NOT_VERIFIED = "not_verified"
}

export interface IData {
  data: any,
  count: any
}

const User = () => {
  const [searchText, setSearchText] = useState('')
  const [size, setSize] = useState(3);
  const [currentTab, setCurrentTab] = useState<string>(TABS.ALL)
  const [user, setUser] = useState<IData | null>(null);
  const [verifiedUser, setVerifiedUser] = useState<IData | null>(null);
  const [notVerifiedUser, setNotVerifiedUser] = useState<IData | null>(null);
  const [userPage, setUserPage] = useState(0)
  const [verifiedUserPage, setVerifiedUserPage] = useState(0)
  const [notVerifiedUserPage, setNotVerifiedUserPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getAllUsers(userPage, size, searchText)
      .then((res) => {
        setIsLoading(false)
        setUser(res.data)
      })
  }, [userPage, !isFetching, searchText])

  useEffect(() => {
    setIsLoading(true)
    getVerifiedUser(verifiedUserPage, size)
      .then((res) => {
        setIsLoading(false)
        setVerifiedUser(res.data)
      })
  }, [verifiedUserPage, !isFetching])

  useEffect(() => {
    setIsLoading(true)
    getNotVerifiedUser(notVerifiedUserPage, size)
      .then((res) => {
        setIsLoading(false)
        setNotVerifiedUser(res.data)
      })
  }, [notVerifiedUserPage, !isFetching])


  const onVerifyUserHandler = async (userId: number) => {
    setIsLoading(true);
    setIsFetching(true)
    const res = await toVerified(userId)
    successNotify(res.data.message)
    setIsLoading(false)
    setIsFetching(false)
  }

  const columns = [
    {
      name: "ID",
      options: {
        display: false,
      },
    },
    "Name",
    "Email",
    {
      name: "Verified",
      options: {
        customBodyRender: (value: any) => {
          return value ? <GoVerified/> : <ImCross/>
        }
      }
    },
    {
      name: "Verify the user",
      options: {
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <button className={'action close_action'} onClick={() => onVerifyUserHandler(tableMeta.rowData[0])}>
              <AiOutlineIssuesClose/>
            </button>
          )
        }
      },
    },
  ]



  return (
    <div className={"page_responsive"}>
      <div className={'header'}>
        <h5>User</h5>
      </div>
      <Tabs
        activeKey={currentTab}
        onSelect={(value) => {
          setCurrentTab(value!)
        }}
      >
        <Tab title={"All Users"} eventKey={TABS.ALL} className={"w-100"}>
          {
            user ?
              (
                <MuiDataTable
                  title={`User List`}
                  data={user}
                  columns={columns}
                  isLoading={isLoading}
                  setSearchText={setSearchText}
                  page={userPage}
                  setPage={setUserPage}
                  search={true}
                />
              ) : (
                <div className="text-center">
                  <Loader />
                </div>
              )
          }
        </Tab>
        <Tab title={"Verified Users"} eventKey={TABS.VERIFIED} className={"w-100"}>
          {
            !isLoading  && verifiedUser ?
              (
                <MuiDataTable
                  title={`Verified Users`}
                  data={verifiedUser}
                  columns={columns}
                  isLoading={isLoading}
                  page={verifiedUserPage}
                  setPage={setVerifiedUserPage}
                  search={false}
                />
              ) : (
                <div className="text-center">
                  <Loader />
                </div>
              )
          }
        </Tab>
        <Tab title={"Not Verified Users"} eventKey={TABS.NOT_VERIFIED} className={"w-100"}>
          {
            !isLoading  && notVerifiedUser ?
              (
                <MuiDataTable
                  title={`Not Verified Users`}
                  data={notVerifiedUser}
                  columns={columns}
                  isLoading={isLoading}
                  page={notVerifiedUserPage}
                  setPage={setNotVerifiedUserPage}
                  search={false}
                />
              ) : (
                <div className="text-center">
                  <Loader />
                </div>
              )
          }
        </Tab>
      </Tabs>
    </div>
  );
};

export default User;
