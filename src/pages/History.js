import React from "react";
import "../App.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import moment from "moment";
import Chart from "../components/Chart";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { formatDate, parseDate } from "react-day-picker/moment";
import "moment/locale/it";

//get Api base on company
const api_key = window.location.pathname + window.location.search;
let url = `http://131.181.190.87:3001${api_key}`;

//get Data to draw the chart
function getChartData(closeData, dateData) {
  let Chart = {
    labels: closeData,
    datasets: [
      {
        label: "Volume",
        fill: true,
        lineTension: 0.5,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: dateData,
      },
    ],
  };
  return Chart;
}

class History extends React.Component {
  constructor(props) {
    super(props);
    this.handleDayChange = this.handleDayChange.bind(this);
    this.state = {
      error: null,
      isLoaded: false,
      chartData: {},
      selectedDay: undefined,
      //setup the columns
      columns: [
        {
          headerName: "Date",
          field: "timestamp",
          sortable: true,
          width: 220,
          valueFormatter: function (params) {
            return moment(params.value).format("DD/MM/YYYY");
          },
          filter: "agDateColumnFilter",
          filterParams: {
            resetButton: true,
            applyButton: true,
            // provide comparator function
            comparator: function (filterLocalDateAtMidnight, cellValue) {
              //using moment js
              var dateAsString = moment(cellValue).format("DD/MM/YYYY");
              var dateParts = dateAsString.split("/");
              var cellDate = new Date(
                Number(dateParts[2]),
                Number(dateParts[1]) - 1,
                Number(dateParts[0])
              );
              if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) {
                return 0;
              }

              if (cellDate < filterLocalDateAtMidnight) {
                return -1;
              }

              if (cellDate > filterLocalDateAtMidnight) {
                return 1;
              }
            },
            browserDatePicker: true,
          },
        },
        {
          headerName: "Symbol",
          field: "symbol",
          sortable: true,
          filter: true,
        },
        {
          headerName: "Industry",
          field: "industry",
          sortable: true,
          filter: true,
        },
        {
          headerName: "Open",
          field: "open",
          sortable: true,
          filter: true,
        },
        {
          headerName: "High",
          field: "high",
          sortable: true,
          filter: true,
        },
        {
          headerName: "Low",
          field: "low",
          sortable: true,
          filter: true,
        },
        {
          headerName: "Close",
          field: "close",
          sortable: true,
          filter: true,
        },
        {
          headerName: "Volumes",
          field: "volumes",
          sortable: true,
          filter: true,
        },
      ],
      defaultColDef: {
        editable: true,
        sortable: true,
        flex: 1,
        minWidth: 100,
        filter: true,
        floatingFilter: true,
        resizable: true,
      },
      rowData: [],
    };
  }

  //When day change set a new state
  handleDayChange(selectedDay) {
    this.setState({
      selectedDay,
    });
  }

  componentDidMount() {
    this.fetchData();
  }

  //fetch api base on url
  fetchData = () => {
    fetch(url)
      .then((res) => res.json())
      .then(
        (rowData) => {
          this.setState({
            rowData,
            isLoaded: true,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  };

  //When press search button fetch new api

  _onPressButton() {
    fetch(
      "http://131.181.190.87:3001" +
        api_key +
        "&from=" +
        moment(this.state.selectedDay).format("YYYY-MM-DD")
    )
      .then((response) => response.json())
      .then(
        (rowData) => {
          this.setState({
            rowData,
            isLoaded: true,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  /**
   * render
   *
   * Render UI
   */
  render() {
    const { error, isLoaded, columns, rowData, selectedDay } = this.state;

    const closeArray = rowData.map(function (item) {
      return item.close;
    });

    const dateArray = rowData.map(function (item) {
      return item.timestamp;
    });

    const dateFormated = dateArray.map(function (item) {
      return moment(item).format("DD/MM/YYYY");
    });

    let chartData = getChartData(dateFormated, closeArray);

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="container">
          <p>Show stock from company {rowData[0].name}</p>
          <div className="input-with-calender">
            <div className="overlay-date-picker-container">
              {" "}
              {selectedDay && (
                <p>Filter data from {selectedDay.toLocaleDateString()}</p>
              )}
              {!selectedDay && <p>Choose a day</p>}
              <DayPickerInput
                onDayChange={this.handleDayChange}
                formatDate={formatDate}
                parseDate={parseDate}
                placeholder={`${formatDate(new Date())}`}
                value={selectedDay}
              />
              <button onClick={() => this._onPressButton()}>Search</button>
            </div>
          </div>
          <div
            className="ag-theme-balham"
            style={{
              height: "300px",
              width: "100%",
              paddingTop: "20px",
            }}
          >
            <AgGridReact
              columnDefs={columns}
              rowData={rowData}
              defaultColDef={this.state.defaultColDef}
              pagination={true}
              paginationPageSize={5}
            />
            {<Chart data={chartData} />}
          </div>
        </div>
      );
    }
  }
}

export default History;
