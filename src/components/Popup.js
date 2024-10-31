
import { css } from "@emotion/react";
import PropTypes from "prop-types";
import React from "react";

const popupStyle = css`
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Popup = ({ feature, showDescription }) => {
  const { id, name, description } = feature.properties;

  return (
    <div id={id} css={popupStyle}>
      <h3>{name}</h3>
      {showDescription && <p>{description || "No description available."}</p>}
    </div>
  );
};

Popup.propTypes = {
  feature: PropTypes.shape({
    properties: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
    }).isRequired,
  }).isRequired,
  showDescription: PropTypes.bool,
};

Popup.defaultProps = {
  showDescription: true,
};

export default Popup;
