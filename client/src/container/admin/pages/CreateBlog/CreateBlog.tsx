import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import Button from '../../../../component/Button/Button';
import { Form } from 'react-bootstrap';
import './CreateBlog.scss';
import Editor from '../../../../component/Editor/Editor';
import { Switch } from '@material-ui/core';
import { createBlog, getBlogById, updateBlogById } from "../../../../services/api/admin/blog";
import Loader from '../../../../component/Loader/Loader';
import { successNotify } from "../../../../utils/toast";

export interface ICreateBlogInput {
   title: string;
   feature_image: File[] | null;
   text: string;
   is_featured: boolean;
}

const CreateBlog = () => {
   const navigate = useNavigate();
   const { id } = useParams();
   const isAddMode = !id;

   const [isLoading, setIsLoading] = useState(false);

   const [formInput, setFormInput] = useState<ICreateBlogInput>({
      title: '',
      is_featured: false,
      text: '',
      feature_image: null,
   });

   useEffect(() => {
      if (!isAddMode) {
         setIsLoading(true);
         getBlogById(id!).then((res) => {
            setFormInput({
               ...formInput,
               title: res.data.title,
               text: res.data.text,
               is_featured: res.data.is_featured,
            });
           setIsLoading(false);
         });
      }
   }, []);

   const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, files } = e.target;
      if (files) {
        setFormInput({
          ...formInput,
          [name]: files[0]
        })
      } else {
        setFormInput({
          ...formInput,
          [name]: value,
        });
      }

   };

   const onFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true)
      const formDate = new FormData();
      if (!isAddMode) {
         if (formInput.feature_image) {
           for (const field in formInput) {
             // @ts-ignore
             formDate.append(field, formInput[field])
           }
           updateBlogById(id, formDate)
             .then((res) => {
               successNotify(res.data.message);
               setIsLoading(false)
               navigate("/admin/blogs")
             })
         } else {
           updateBlogById(id, formInput)
             .then((res) => {
               successNotify(res.data.message);
               setIsLoading(false)
               navigate("/admin/blogs")
             })
         }

      } else {
        for (const field in formInput) {
          // @ts-ignore
          formDate.append(field, formInput[field])
        }
        createBlog(formDate)
          .then((res) => {
            successNotify(res.data.message);
            setIsLoading(false)
            navigate("/admin/blogs")
          })
      }
   };

   const onTextChangeHandler = (value: string) => {
      setFormInput({
         ...formInput,
         text: value,
      });
   };

   return (
      <div className={'page_responsive'}>
         {!isLoading ? (
            <React.Fragment>
               <div className={'header'}>
                  <h5>{isAddMode ? 'Create' : 'Update'} Blog</h5>
                  <NavLink to={'/admin/blogs'}>
                     <Button className={'px-2 py-2 mb-3'}>Back</Button>
                  </NavLink>
               </div>

               <Form onSubmit={onFormSubmit}>
                  <div className={'create_form'}>
                     <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                           required
                           type={'text'}
                           name={'title'}
                           value={formInput.title}
                           onChange={onChangeHandler}
                        />
                     </Form.Group>

                     <Form.Group>
                        <Form.Label>Feature Image</Form.Label>
                        <Form.Control
                           required={isAddMode}
                           type={'file'}
                           name={'feature_image'}
                           onChange={onChangeHandler}
                        />
                     </Form.Group>

                     <Form.Group>
                        <span> OFF </span>
                        <Switch
                           checked={formInput.is_featured}
                           onChange={ (e) => {
                             setFormInput({
                               ...formInput,
                               is_featured: e.target.checked
                             })
                           }}
                           color={'primary'}
                        />
                        <span> ON </span>
                     </Form.Group>

                     <Form.Group>
                        <Form.Label>Text</Form.Label>
                        <Editor
                           value={formInput.text}
                           onChange={onTextChangeHandler}
                        />
                     </Form.Group>
                     <Button type={'submit'}>Save</Button>
                  </div>
               </Form>
            </React.Fragment>
         ) : (
            <div className="text-center">
               <Loader />
            </div>
         )}
      </div>
   );
};

export default CreateBlog;
