import React, {  useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { AiFillPlusCircle } from 'react-icons/ai';
import './FoodDetail.scss';
import InfiniteScroll from 'react-infinite-scroll-component';
import { createFoodProduct, getFoodProduct } from "../../services/api/calorie";
import Loader from '../../component/Loader/Loader';
import Button from "../../component/Button/Button";
import { useParams, useNavigate } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai"
import { errorNotify, successNotify } from "../../utils/toast";
import { getHelmet } from "../../utils/helmet";
import { v4 as uuidv4 } from 'uuid';
const _ = require('lodash');

interface IFood {
   id?: string;
   fdcId : number;
   name: string;
   calorie: {
      value: number
   },
   protein: {
      value: number
   },
   fat: {
      value: number
   },
   carb: {
      value: number
   },
   sugar: {
      value: number
   }
}

const FoodDetail = () => {
   const { id } = useParams();
   const navigation = useNavigate();
   const [query, setQuery] = React.useState('');
   const [pageNumber, setPageNumber] = React.useState(1);
   const [totalPages, setTotalPages] = React.useState(null);
   const [food, setFood] = React.useState<any>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [hasMore, setHasMore] = React.useState(true);
   const [submitLoader, setSubmitLoader] = useState(false)

   const fetchMoreData = () => {
      if (pageNumber === totalPages) {
         setHasMore(false);
         return;
      }

      getFoodProduct(query, pageNumber + 1)
         .then((res) => {
            setTotalPages(res.data.totalPages);
            setFood([...food, ...res.data.foods]);
            setPageNumber(pageNumber + 1);
            setIsLoading(false);
         })
         .catch(() => {
            setIsLoading(false);
         });

   };

   const [selectedItem, setSelectedItem] = useState<IFood[]>([]);

   const onAddFoodItem = (item: IFood) => {
      const selectedItemClone = selectedItem.concat();
      const foodItem = {
         id: uuidv4(),
         ...item
      }
      selectedItemClone.push(foodItem);
      setSelectedItem(selectedItemClone);
   };

   const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value)
   }

   const onFormSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     setIsLoading(true)
      getFoodProduct(query, pageNumber).then((res) => {
         setFood(res.data.foods);
         setTotalPages(res.data.totalPages);
         setIsLoading(false)
      });
   }

   const onCalculateHandler = () => {
      if (selectedItem.length > 0) {
         setSubmitLoader(true)
         const allSelectedFoods = selectedItem.concat();
         // @ts-ignore
         const sum = allSelectedFoods.reduce((prevVal, curVal) => {
            return {
               calorie: {
                  value: prevVal.calorie.value + curVal.calorie.value,
               },
               protein: {
                  value: prevVal.protein.value + curVal.protein.value,
               },
               fat: {
                  value: prevVal.fat.value + curVal.fat.value
               },
               carb: {
                  value: prevVal.carb.value + curVal.carb.value
               },
               sugar: {
                  value: prevVal.sugar.value + curVal.sugar.value
               }
            }
         }, {
            calorie: {
               value: 0
            },
            protein: {
               value: 0
            },
            fat: {
               value: 0
            },
            carb: {
               value: 0
            },
            sugar: {
               value: 0
            }
         })

         const foodAnalysis = {
            ...sum,
            mealType: id,
         }

         createFoodProduct(foodAnalysis)
           .then((res) => {
              setSubmitLoader(false)
              successNotify(res.data.message);
              navigation(`/food-stats/${res.data.id}/SUM`)
           })
      } else {
         errorNotify('Please add atleast one food product')
      }
   }


   const onItemRemoveHandler = (id: string) => {
      const selectedItemClone = selectedItem.filter((item: IFood) => item.id !== id);

      setSelectedItem(selectedItemClone)
   }

   return (
      <Container fluid>
         { getHelmet('Food Details') }
         <Row className={'justify-content-center'}>
            <Col md={8} className="breakfast_details">
               <h5>{ id } Details</h5>
               <Form onSubmit={onFormSubmit}>
                  <Form.Group className={"form-row"}>
                     <Form.Control
                        onChange={onChangeHandler}
                        className="search_input col-md-10 pl-3"
                        type="text"
                        placeholder="Search Items"
                     />
                     <Button className={"col-md-2"}>
                        Search
                     </Button>
                  </Form.Group>
               </Form>

               {
                  !isLoading ?
                    food.length > 0 ?
                      (
                        (
                          <InfiniteScroll
                            className={'col-md-12'}
                            next={fetchMoreData}
                            hasMore={hasMore}
                            loader={
                               <div className="text-center">
                                  <Loader />
                               </div>
                            }
                            dataLength={food.length}
                            endMessage={
                               <h5 className={'text-center my-3'}>
                                  Yay! You have seen it all
                               </h5>
                            }
                          >
                             <Row className={'mt-4'}>
                                {food.map((item: any) => (
                                  <Col md={4} className={'mb-4'} key={item.fdcId}>
                                     <div className="food_items">
                                        <div className={'food_items_stats'}>
                                           <h4>{item.name}</h4>
                                           <p>Calorie: {item.calorie.value}</p>
                                        </div>
                                        <AiFillPlusCircle
                                          onClick={() => onAddFoodItem(item)}
                                        />
                                     </div>
                                  </Col>
                                ))}
                             </Row>
                          </InfiniteScroll>
                        )
                      ): (
                        <div className="text-center mt-4">
                           <h5 className="mt-5">No Food Found</h5>
                        </div>
                      )
                      :  (
                      <div className="text-center">
                         <Loader />
                      </div>
                    )
               }
            </Col>
            <Col md={3} className={'quick_details'}>
               <h5>Quick Details</h5>
               <hr />
               {selectedItem.length > 0 ? (
                  selectedItem.map((item) => (
                     <React.Fragment key={item.fdcId}>
                        <div
                           className={
                              'd-flex justify-content-between align-items-center mt-3 selected_item'
                           }
                           key={item.fdcId}
                        >
                           <div
                              className={
                                 'd-flex align-items-center justify-content-center'
                              }
                           >
                              <p className={'p-0 m-0 ml-3'}>{item.name}</p>
                           </div>
                           <p className={'p-0 m-0'}><span>{item.calorie.value}</span> Calories</p>
                           <AiFillDelete onClick={() => onItemRemoveHandler(item.id!)}/>
                        </div>
                        <hr />
                     </React.Fragment>
                  ))
               ) : (
                  <p className={'text-center'}>Please select food item</p>
               )}
               {
                  !submitLoader ? (
                    <div className={"text-center"}>
                       <Button onClick={onCalculateHandler}  className={'w-100'}>Calculate</Button>
                    </div>
                  ) : (
                    <div className="text-center">
                       <Loader />
                    </div>
                  )
               }
            </Col>
         </Row>
      </Container>
   );
};
export default FoodDetail;
