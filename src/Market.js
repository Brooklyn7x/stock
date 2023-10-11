// Market.js

import React, { useState, useEffect } from "react";

const apiUrl =
  "https://f68370a9-1a80-4b78-b83c-8cb61539ecd6.mock.pstmn.io/api/v1/get_market_data/";
const stockSymbol = "AAPL";

const Market = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [currData, setCurrData] = useState([]);
  const [prevClosingPrice, setPrevClosingPrice] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch(apiUrl);
      if (res.ok) {
        const json = await res.json();
        setData(json.data);

        // Set the previous day's closing price after fetching data
        if (json.data.length > 1) {
          setPrevClosingPrice(json.data[json.data.length - 2].close);
        }

        setCurrData(fetchRows(data, page));
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
    }
  };

  function fetchRows(array, page) {
    const rowsPerPage = 7;
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return array.slice(startIndex, endIndex);
  }

  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrData(fetchRows(data, page));
  }, [page, currData]);

  const handlePrevClick = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextClick = () => {
    const totalPages = Math.ceil(data.length / 7);
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="market-container">
      <h1>Market Data for {stockSymbol}</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Opening Price</th>
            <th>Closing Price</th>
          </tr>
        </thead>
        <tbody>
          {currData.length === 0
            ? "Loading..."
            : currData.map((entry, index) => {
                const prevClosingPrice =
                  index > 0 ? currData[index - 1].close : null;
                return (
                  <tr key={index}>
                    <td>{formatDate(entry.date)}</td>
                    <td
                      style={{
                        color:
                          prevClosingPrice === null
                            ? "black"
                            : entry.open > prevClosingPrice
                            ? "green"
                            : entry.open < prevClosingPrice
                            ? "red"
                            : "black",
                      }}
                    >
                      {entry.open}
                    </td>
                    <td
                      style={{
                        color:
                          entry.close > entry.open
                            ? "green"
                            : entry.close < entry.open
                            ? "red"
                            : "black",
                      }}
                    >
                      {entry.close}
                    </td>
                  </tr>
                );
              })}
        </tbody>
      </table>
      <div className="button-container">
        <div className="pagination">
          <button onClick={handlePrevClick}>Prev</button>
          <button onClick={handleNextClick}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Market;
