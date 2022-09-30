import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import Loader from "../../../../component/Loader/Loader";
import { NavLink } from "react-router-dom";
import Button from "../../../../component/Button/Button";
import { getAllBlog } from "../../../../services/api/admin/blog";
import { AiOutlineIssuesClose } from "react-icons/ai"
import { useNavigate } from "react-router-dom";
import './Blog.scss';
import MuiDataTable from "../../../../component/MuiDataTable/MuiDataTable";
import { IData } from "../User/User";

const Blog = () => {
  const navigation = useNavigate();
  const [size, setSize] = useState(3);
  const [searchText, setSearchText] = useState('')
  const [page, setPage] = useState(0)
  const [blog, setBlog] = useState<IData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true)
    getAllBlog(page, size, searchText)
      .then((res) => {
        setBlog(res.data)
        setIsLoading(false)
      })
  }, [page, searchText])


  const columns = [
    "ID",
    "Title",
    {
      name: "Edit Menu Type",
      options: {
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <button className={'action close_action'} onClick={() => navigation(`/admin/update/blog/${tableMeta.rowData[0]}`)}>
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
        <h5>Blog</h5>
        <NavLink to={'/admin/create/blog'}>
          <Button className={'px-2 py-2 mb-3'}>+ Create New Blog</Button>
        </NavLink>
      </div>
      {
        blog  ?
          (
            <MuiDataTable
              title={`Blog List`}
              data={blog}
              columns={columns}
              isLoading={isLoading}
              setSearchText={setSearchText}
              page={page}
              setPage={setPage}
              search={true}
            />
          ) : (
            <div className="text-center">
              <Loader />
            </div>
          )
      }
    </div>
  );
};

export default Blog;
