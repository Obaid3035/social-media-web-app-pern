import React from "react";
import Verified from "../../assets/img/verified.png";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "./VerifiedBadge.scss";

const renderTooltip = (props: any) => (
  <Tooltip id="button-tooltip" {...props}>
    <p> Certified Nutritionist</p>
  </Tooltip>
);

const VerifiedBadge = () => {

  return (
    <OverlayTrigger
      placement="bottom"
      delay={{ show: 150, hide: 150 }}
      overlay={renderTooltip}>
      <img alt={"verified"}
           id={'verified_badge'}
           src={Verified}
           width={20}
           height={20} />
    </OverlayTrigger>
  );
};

export default VerifiedBadge;
