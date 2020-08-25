import React from "react";
import "../App.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

class Stock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      columns: [
        {
          headerName: "Symbol",
          field: "symbol",
          sortable: true,
          filter: "agTextColumnFilter",
          filterParams: {
            resetButton: true,
            applyButton: true,
            debounceMs: 200,
          },
          cellRenderer: function (params) {
            return (
              "<a href='/history?symbol=" +
              params.value +
              "'> " +
              params.value +
              "</a>"
            );
          },
        },
        {
          headerName: "Name",
          field: "name",
          sortable: true,
          filter: true,
        },
        {
          headerName: "Industry",
          field: "industry",
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
      rowData: null,
    };
  }
  /**
   * componentDidMount
   *
   * Fetch json array of objects from given url and update state.
   */
  componentDidMount() {
    fetch("http://131.181.190.87:3001/all")
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
  }

  /**
   * render
   *
   * Render UI
   */
  render() {
    const { error, isLoaded, columns, rowData } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="container">
          <p>Please use the top columns to filter</p>
          <div
            className="ag-theme-balham"
            style={{
              height: "300px",
              width: "600px",
              margin: "auto",
            }}
          >
            <AgGridReact
              columnDefs={columns}
              rowData={rowData}
              pagination={true}
              defaultColDef={this.state.defaultColDef}
              paginationPageSize={5}
            />
          </div>
        </div>
      );
    }
  }
}

export default Stock;
