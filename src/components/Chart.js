import { Line } from "react-chartjs-2";
import React, { Component } from "react";

export default class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
  }

  static defaultProps = {
    displayTitle: true,
    displayLegend: true,
    legendProsition: "right",
  };

  render() {
    return (
      <div className="Chart">
        <Line
          data={this.props.data}
          width={100}
          height={300}
          options={{
            title: {
              display: this.props.displayTitle,
              text: "Closing Price",
              fontSize: 20,
            },
            maintainAspectRatio: false,
            legend: {
              display: this.props.displayLegend,
              position: this.props.legendProsition,
            },
          }}
        />
      </div>
    );
  }
}
