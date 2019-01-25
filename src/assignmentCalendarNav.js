

// IMPORTS
import React, { Component } from 'react';


/************************************************************************
 *
 *          Name: AssignmentCalendarNav
 *        Author: Mike Lawler
 *          Date: 190124
 *       Purpose: Renders the header row for the calendar app, which
 *                displays the month and year and controls to advance
 *                or rewind a month.
 *     Revisions:
 *
 ************************************************************************/
class AssignmentCalendarNav extends Component {


    render() {
        return (
            <div id="assignment-calendar-nav" className="row">
                <div id="assignment-calendar-left" className="col-1 text-center">
                    <i className='fas fa-arrow-alt-circle-left assignment-calendar-nav' onClick={this.props.monthBack.bind(this)} />
                </div>
                <div id="assignment-calendar-month-year" className="col-5 text-center">{this.props.monthYear}</div>
                <div id="assignment-calendar-right" className="col-1 text-center">
                    <i className="fas fa-chevron-circle-right assignment-calendar-nav" onClick={this.props.monthForward.bind(this)} />
                </div>
            </div>

        );
    }
}

export default AssignmentCalendarNav;



