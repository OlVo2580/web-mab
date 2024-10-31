import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";

const chartContainer = {
  display: "flex",
  marginTop: "500px",
  width: "100%",
  justifyContent: "center",
};

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const DataChart = ({ diagramData }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      if (diagramData) {
        setChartData(diagramData);
        setLoading(false);
      } else {
        setError("No data available.");
        setLoading(false);
      }
    }, 1000);
  }, [diagramData]);

  return (
    <div style={chartContainer}>
      {loading ? (
        <div className="sweet-loading">
          <ClipLoader
            css={override}
            size={150}
            color={"#123abc"}
            loading={loading}
          />
        </div>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div style={{ width: "50%", height: "500px" }}>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              title: {
                display: true,
                text: "Average Data per month",
                fontSize: 20,
              },
              legend: {
                display: true,
                position: "right",
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DataChart;
