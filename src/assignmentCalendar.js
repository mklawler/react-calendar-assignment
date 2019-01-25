

// IMPORTS
import React, { Component } from 'react';
import $ from 'jquery';
import * as global from './global';
import * as errorHandler from './errors';
import * as config from './config/config';
import AssignmentCalendarNav from './assignmentCalendarNav';
import AssignmentCalendarBlock from './assignmentCalendarBlock';

// Array of month names for use in header
const _months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Get correct config
const cfg = config.getConfiguration();


/************************************************************************
 *
 *          Name: AssignmentCalendar
 *        Author: Mike Lawler
 *          Date: 190124
 *       Purpose: Renders a calendar application, which pulls reminder notes
 *                from API (NodeJS running within this same project)
 *     Revisions:
 *
 ************************************************************************/
class AssignmentCalendar extends Component {

  // Fires when component is ready
  componentDidMount() {

    // Init our flag used for triggering refresh
    this.setState({flagForRefresh: false});

    // Default date to current month
    if (global.currentDate == null)
      global.currentDate = new Date();

    // Call monthChange with 0 will set initial date and populate header
    this.monthChange(0);

    // Retrieve month data from API and populate calendar
    AssignmentCalendar.fetchMonth(null, this.populateCalendar.bind(this)).catch(err => errorHandler.logError(err.reason)).then();


  }

  // Populates the blank calendar grid with the correct dates and contents for the given month
  // If no calendarDate is specified, uses the most recently used date (stored in global)
  // If no calendarDetailData is provided, just populates the dates for the month without any notes

  populateCalendar(calendarDate, calendarDetailData) {

    // When debugging, note details
    errorHandler.logInfo("populateCalendar - \ncalendarDate: " + calendarDate + "\ncalendarDetailData: " + calendarDetailData);

    // Check date parameter and make sure we have a valid date if not provided
    if (calendarDate == null) {
      if (global.currentDate != null)
        calendarDate = global.currentDate;
      else
        calendarDate = new Date();
    }

    // Store current date
    global.currentDate = calendarDate;

    // Parse into month and year
    let month = calendarDate.getMonth();
    let year = calendarDate.getFullYear();

    // Get the first day of the month so we can determine where to place all of the days around it
    let firstDayOfMonth = new Date(year, month, 1);

    // Determine the first of the month's day of the week.  Remember this is 0-based in js.
    let firstDayMonth_dayOfWeek = firstDayOfMonth.getDay();

    // Now let's back up to the previous Sunday (index 0) and get the date.  What we are doing here
    // is backing up the first of the month by the number of days specified by the index of the day
    // of the week.  For example, if it is a Tuesday on the 1st, that is index 2.  If we back up 2 days
    // from the first, we will get to the date on Sunday (index 0).
    firstDayOfMonth.setDate(firstDayOfMonth.getDate() - firstDayMonth_dayOfWeek);

    // Next we are going to iterate through all 42 blocks of the calendar and assign a date (number),
    // a class (different styles for current month versus not), and populate any notes we have retrieved
    // via the API.

    // Define some variables we will need as we iterate
    let calendarBlockClassName, calendarBlockNote, calendarBlockDate;

    // We are going to create an array of content that we can then use in our Render method.  This method allows us
    // to dynamically generate content outside of the Render method.
    let blocks = [];

    // Iterate through all calendar blocks.  Remember this is 0-based.
    for (let a = 0; a < 42; a++) {

      // Pull note if there is one
      calendarBlockNote = AssignmentCalendar.getNote(firstDayOfMonth.getDate(),calendarDetailData);

      // Build contents
      if (month !== firstDayOfMonth.getMonth()) {
        calendarBlockClassName = "assignment-calendar-block-inactive";
        calendarBlockDate = <button className={calendarBlockClassName}>{firstDayOfMonth.getDate()}</button>;
        calendarBlockNote = null;
      }
      else if ((month === new Date().getMonth()) && (firstDayOfMonth.getDate() < new Date().getDate())) {
        calendarBlockClassName = "assignment-calendar-block-active-past";
        calendarBlockDate = <span className={calendarBlockClassName}>{firstDayOfMonth.getDate()}</span>;
        calendarBlockNote = <div className={'assignment-calendar-note'}>{calendarBlockNote}</div>;
      }
      else {
        calendarBlockClassName = "assignment-calendar-block-active";
        calendarBlockDate = <span className={calendarBlockClassName}>{firstDayOfMonth.getDate()}</span>;
        calendarBlockNote = <div className={'assignment-calendar-note'}>{calendarBlockNote}</div>;

      }


      // Push content into array for block
      //blocks.push(<div id={"assignment-calendar-block"+x} className='col-1 border border-dark assignment-calendar-block' key={x}><div id={"assignment-calendar-block"+x+"_Day"} className='assignment-calendar-day'></div><div id={"assignment-calendar-block"+x+"_Note"}></div></div>);
      blocks.push(<AssignmentCalendarBlock key={'key-'+a} number={a} note={calendarBlockNote} date={calendarBlockDate}/>);


      // If we are at the week boundary, put up the correct bootstrap class for a break
      if (((a + 1) % 7) === 0)
        blocks.push(<div key={'break-' + a} className="w-100"/>);

      // Advance to next date
      firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);

    }

    this.blocks = blocks;

    this.refresh();


  }

  // Forces React to re-render the component.  This is not an ideal approach, but currently best
  // method to deal with unpredictable behavior when modifying child objects

  refresh() {
    try {
      this.setState({flagForRefresh: !this.state.flagForRefresh});
    }
    catch(e){
      this.setState({flagForRefresh: false});
    }
  }


  // Pulls out note contents from given details object (retrieved from API)
  static getNote(calendarDate, calendarDetailData) {

    // When debugging, note details
    errorHandler.logInfo("getNote - \ncalendarDate: " + calendarDate + "\ncalendarDetailData: " + calendarDetailData);

    // Create return variable and init with blank result
    let result = "";

    // We are trapping errors here in cases where there is no note.
    try
    {
        // If we have data for the days array, loop through and find anything for the
        // given day (calendarDate)

        if (calendarDetailData.days.length > 0) {
          for (let x = 0; x < calendarDetailData.days.length; x++) {
            if (parseInt(calendarDetailData.days[x].day) === calendarDate) {

              // We have a match
              result = calendarDetailData.days[x].note;

              // Exit loop
              break;
            }
          }
        }
    }
    catch(e) {
      // Log errors here in debug mode to the console (not really errors per se)
      errorHandler.logInfo("getNote error: ");
    }
    return result;
  }



  // Moves entire calendar forward a month
  monthBack() {
    this.monthChange(-1);
  }



  // Moves entire calendar backward a month
  monthForward() {
    this.monthChange(1);
  }



  // Common method for moving calendar
  monthChange(months) {

    // When debugging, note details
    errorHandler.logInfo("monthChange - \nmonths: " + months);

    // Parse month and year and add months
    let month = global.currentDate.getMonth() + months;
    let year = global.currentDate.getFullYear();
    if (month < 0) {
      month += 12;
      year--;
    }
    else if (month > 11) {
      month -= 12;
      year++;
    }

    //TODO: Change to use setMonthYear of child object!!
    //

    // Use the name area const _months to get the name of the month
    $("#assignment-calendar-month-year").text(_months[month] + ", " + year);

    // Get new date now
    let newDate = new Date(year,month,1);

    // Store new date in global
    global.currentDate = newDate;

    // If we moved months, hit the API for data for the new date
    if (months !== 0) {
      AssignmentCalendar.fetchMonth(newDate, this.populateCalendar.bind(this)).catch(err => errorHandler.logError(err.reason));
    }


  }



  // Hit the API to get information about the current month and then pass it one for insertion.  Note that this
  // is asynchronous method.  This READs the current month data only!

  static fetchMonth = async (newDate, callback) => {

    // Use current date unless one is passed in
    let currentDate = global.currentDate;
    if (newDate != null)
      currentDate = newDate;

    // Build REST call based on year and month
    let apiUri = cfg.server.address + ":" + cfg.server.port + "/api/calendar/" + currentDate.getFullYear() + "/" + (currentDate.getMonth()+1);

    // Trap errors here and fallback to current month in that case
    try {
      const response = await fetch(apiUri);

      const json = await response.json();

      // Populate calendar with month defaulted to the first day of the month
      callback(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), json);

    }
    catch(e) {
      errorHandler.logError(e);
      callback();
    }

  };

  // React render method.  This does the heavy lifting of writing the HTML UI
  render() {
    return (

        <div id="assignment-calendar" className="container">

          <AssignmentCalendarNav monthBack={this.monthBack.bind(this)} monthForward={this.monthForward.bind(this)}/>
          <div className="w-100"/>
          <div id="assignment-calendar-grid" className="row">
            <div className="col-1">Sun</div>
            <div className="col-1">Mon</div>
            <div className="col-1">Tue</div>
            <div className="col-1">Wed</div>
            <div className="col-1">Thu</div>
            <div className="col-1">Fri</div>
            <div className="col-1">Sat</div>

            <div className="w-100"/>
            {this.blocks}


          </div>
      </div>);

  }
}



export default AssignmentCalendar;
