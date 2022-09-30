import { Helmet } from "react-helmet";
import React from "react";

export const getHelmet = (pageTitle: string) => {

  return (
    // @ts-ignore
    <Helmet>
      <title>{pageTitle} - Carerely</title>
    </Helmet>
  )
}
