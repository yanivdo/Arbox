import React from "react";
import "./App.css";
import BuildingGrid from "./components/BuildingGrid";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page:1
    };
  }

  render() {

    return (
      <div className="bodySite">
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
          integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
          crossorigin="anonymous"
        />
        <div className="wrapper">
            <BuildingGrid />
        </div>
      </div>
    );
  }
}

export default App;
