import React from "react";

class Elevators extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            elevators: 5,
        };
    }


    render() {
        var elevatorsDetails = [];
        for (var i = 0; i < this.state.elevators; i++) {
            var elevatorSvg = "";
            if(this.props.floor === this.props.elevatorsPlace[i]){
                elevatorSvg = <img className="elevatorImg" alt="elevator" src={"http://localhost/client/public/elevator.svg"} />;
            }
            elevatorsDetails.push(<div className="elevatorNum">{elevatorSvg}</div>);
        }
        return (
            <div className="elevatorsSection">
                {elevatorsDetails}
            </div>
        );
    }
}

export default Elevators;