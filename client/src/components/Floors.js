import React from "react";
import Elevators from "./Elevators";
class Floors extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            floors: 10,
            intervalId: 0,
            floorStatus: [],
            elevatorsPlaces: [],
            movment: 0,
            elevatorMoving: {
                elevator: [],
                from: [],
                to: [],
                distance: []
            }
        };
        this.url = "http://localhost/client/public/ding.mp3";
        this.audio = new Audio(this.url);
    }

    callElevator = (e, floor) => {
        fetch("http://localhost/Building/elevatorCallApi", {
            method: "POST",
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                floor: floor
            }),
        }).then((response) => response.json())
            .then((result) => {
                let arrayCopyStatus = this.state.floorStatus.slice();
                arrayCopyStatus[floor] = "Waiting";
                this.updateElevatorQueue(result.elevator, floor);
                this.setState({
                    floorStatus: arrayCopyStatus,
                });
            });
    }
    getIndex = (value, arr) => {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === value) {
                return i;
            }
        }
        return -1;
    }
    updateElevatorQueue = (elevator, floor, fromChange = this.state.elevatorsPlaces[elevator], reset = 0) => {
        let elevatorArray = this.state.elevatorMoving.elevator.slice();
        let fromArray = this.state.elevatorMoving.from.slice();
        let toArray = this.state.elevatorMoving.to.slice();
        var elevatorInQueue = this.getIndex(elevator, elevatorArray);
        if (reset) {
            elevatorArray.splice(elevatorInQueue, 1);
            fromArray.splice(elevatorInQueue, 1);
            toArray.splice(elevatorInQueue, 1);

            let arrayCopyStatus = this.state.floorStatus.slice();
            arrayCopyStatus[floor] = "Arrived";
            this.setState({
                floorStatus: arrayCopyStatus
            });
            this.audio.play();
            
            setTimeout(() => {
                arrayCopyStatus[floor] = "Call";
                    this.setState({
                        floorStatus: arrayCopyStatus
                    });
                    this.updateCheckElevator();
                }, 2000);
                this.updateElevatorStatus(elevator);
        } else {
            if (elevatorInQueue === -1) {
                elevatorArray.push(elevator);
                fromArray.push(fromChange);
                toArray.push(floor);
            } else {
                elevatorArray[elevatorInQueue] = elevator;
                fromArray[elevatorInQueue] = fromChange;
                toArray[elevatorInQueue] = floor;
            }
        }
        let elevatorMovingObj = {
            elevator: elevatorArray,
            from: fromArray,
            to: toArray
        }
        this.setState({
            elevatorMoving: elevatorMovingObj
        });
    }

    startElevatorMove = () => {
        for (let i = 0; i < this.state.elevatorMoving.elevator.length; i++) {
            var elevator = this.state.elevatorMoving.elevator[i];
            var start = this.state.elevatorMoving.from[i];
            var end = this.state.elevatorMoving.to[i];
            if (start === end) {
                this.updateElevatorQueue(elevator, end, start, 1);
            } else {
                if (start < end) {
                    this.moveElevatorUp(elevator, start, end);
                } else {
                    this.moveElevatorDown(elevator, start, end);
                }
            }
        }
    }

    moveElevatorUp = (elevator, start, end) => {
        let arrayCopy = this.state.elevatorsPlaces.slice();
        let nextFloor = start + 1;
        arrayCopy[elevator] = nextFloor;
        this.moveElevatorBySpeed(arrayCopy);
        this.updateElevatorQueue(elevator, end, nextFloor);
    }

    moveElevatorDown = (elevator, start, end) => {
        let arrayCopy = this.state.elevatorsPlaces.slice();
        let nextFloor = start - 1;
        arrayCopy[elevator] = nextFloor;
        this.moveElevatorBySpeed(arrayCopy);
        this.updateElevatorQueue(elevator, end, nextFloor);
    }

    moveElevatorBySpeed = (arrayCopy) => {
        this.setState({
            elevatorsPlaces: arrayCopy,
        });
    }

    updateElevatorStatus = (elevator) => {
        fetch("http://localhost/Building/updateElevatorStatus", {
            method: "POST",
            credentials: 'include',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                elevatorNum: elevator
            }),
        }).then((response) => response.json())
            .then((result) => {
            });
    }

    componentDidMount = () => {
        setInterval(() => {
            if (this.state.elevatorMoving.elevator) {
                this.startElevatorMove();
            }
        }, 1000);
        this.checkElevatorPlace();
        var copyArray = [];
        for (let i = 0; i < this.state.floors; i++) {
            copyArray[i] = "Call";
        }
        this.setState({
            floorStatus: copyArray,
        });
    };
    updateCheckElevator = () => {
        for(let i = 0; i < this.state.elevatorsPlaces.length; i++){
            var place = this.state.elevatorsPlaces[i];
            if(this.state.elevatorsPlaces[place] !== "Call"){
                let arrayCopyStatus = this.state.floorStatus.slice();
                arrayCopyStatus[place] = "Call";
                this.setState({
                    floorStatus: arrayCopyStatus
                });
            }
        }
    }
    checkElevatorPlace = () => {
        fetch("http://localhost/Building/elevatorsPlaces", {
            method: "POST",
            credentials: 'include',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
            }),
        }).then((response) => response.json())
            .then((result) => {
                this.setState({
                    elevatorsPlaces: result,
                    page: 1
                });
            });
    }

    render() {
        if (!this.state.page) {
            return <div className="Loading"></div>;
        }
        var floorDetails = [];
        for (var i = this.state.floors - 1; i >= 0; i--) {
            var elevatorCall = "free";
            if (this.state.floorStatus[i] === "Waiting" || this.state.floorStatus[i] === "Arrived") {
                elevatorCall = "Occupied";
            }
            let floor = i;
            floorDetails.push(
                <div className={`floorSection floorBlock_${i}`}>
                    <div className="floorNum">{floor}</div>
                    <Elevators floor={i} elevatorsPlace={this.state.elevatorsPlaces} />
                    <div className={`elevatorCall ${elevatorCall}`} name="elevatorCall" onClick={(e) => this.callElevator(e, floor)}>{this.state.floorStatus[i]}</div>
                </div>
            );
        }
        return (
            <div className="floorsWrapper">
                {floorDetails}
            </div>
        );
    }
}

export default Floors;