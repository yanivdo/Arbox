import React from "react";
import Floors from "./Floors";

class BuildingGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount = () => {
        
    };


    render() {
        return (
            <div className="gridWrapper">
                <div className="title">Elevator Exercise</div>
                <div className="gridInner">
                    <Floors />
                </div>
            </div>
        );
    }
}

export default BuildingGrid;