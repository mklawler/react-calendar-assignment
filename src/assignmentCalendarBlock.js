

// IMPORTS
import React, { Component } from 'react';


/************************************************************************
 *
 *          Name: AssignmentCalendarBlock
 *        Author: Mike Lawler
 *          Date: 190124
 *       Purpose: Renders a block (day) within the master calendar grid.
 *                The calendar consists of 42 blocks (6 weeks) which we
 *                then populate with specific days and reminder notes.
 *     Revisions:
 *
 ************************************************************************/
class AssignmentCalendarBlock extends Component {

    render() {
        console.log("Block render");
        return (<div id={"assignment-calendar-block"+this.props.number} className='col-1 border border-dark assignment-calendar-block' key={this.props.number}>
                    <div id={"assignment-calendar-block"+this.props.number+"_Day"} className='assignment-calendar-day'>
                        {this.props.date}
                    </div>
                    <div id={"assignment-calendar-block"+this.props.number+"_Note"}>
                        {this.props.note}
                    </div>
                </div>

        );
    }
}

export default AssignmentCalendarBlock;


/*

 */