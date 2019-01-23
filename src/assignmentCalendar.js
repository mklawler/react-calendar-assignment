'use strict';

// IMPORTS
import React, { Component } from 'react';
import $ from 'jquery';
import * as global from './global';
import * as errorHandler from './errors';
import * as config from './config/config.json';

// Array of month names for use in header
const _months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Get correct config
let cfg;
switch(process.env.NODE_ENV) {
  case "test": {
    cfg = config.test;
    break;
  }
  case "production": {
    cfg = config.production;
    break;
  }
  default: {
    cfg = config.development;
  }

}
if ((cfg == null) || (cfg == undefined))
  cfg = config.development;

//const cfg = (eval("config." + process.env.NODE_ENV) || (config.development));

// Primary React Component
class AssignmentCalendar extends Component {

  constructor(props) {
    super(props);
  }

  // Fires when component is ready
  componentDidMount() {

    // Default date to current month
    if (global.currentDate == null)
      global.currentDate = new Date();

    // Build blocks
    this.monthChange(0);

    // Retrieve month data from API and populate calendar
    this.fetchMonth();

  }

  // Populates the blank calendar grid with the correct dates and contents for the given month
  // If no calendarDate is specified, uses the most recently used date (stored in global)
  // If no calendarDetailData is provided, just populates the dates for the month without any notes

  populateCalendar(calendarDate, calendarDetailData) {

    // When debugging, note details
    errorHandler.logInfo("populateCalendar - \ncalendarDate: " + calendarDate + "\n" + "calendarDetailData: " + calendarDetailData);

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
    let calendarBlock, calendarBlockClassName, calendarBlockNote, calendarBlockContents;

    // Iterate through all calendar blocks.  Note this is 1-based, NOT 0-based.
    for (let a = 1; a < 43; a++) {

      // Get reference to block
      calendarBlock = $("#AssignmentCalendarBlock" + a + "_Day");

      // Pull note if there is one
      calendarBlockNote = this.getNote(firstDayOfMonth.getDate(),calendarDetailData);

      // Build contents
      if (month !== firstDayOfMonth.getMonth()) {
        calendarBlockClassName = "inactive";
        calendarBlockContents = "<a href='' class='" + calendarBlockClassName + "'>" + firstDayOfMonth.getDate() + "</a>";
      }
      else if ((month === new Date().getMonth()) && (firstDayOfMonth.getDate() < new Date().getDate())) {
        calendarBlockClassName = "active-past";
        calendarBlockContents = "<span href='' class='" + calendarBlockClassName + "'>" + firstDayOfMonth.getDate() + "</span><div class='AssignmentCalendarNote'>" + calendarBlockNote + "</div>";
      }
      else {
        calendarBlockClassName = "active";
        calendarBlockContents = "<span href='' class='" + calendarBlockClassName + "'>" + firstDayOfMonth.getDate() + "</span><div class='AssignmentCalendarNote'>" + calendarBlockNote + "</div>";
      }

      // Write block contents
      calendarBlock.html(calendarBlockContents);

      // Advance to next date
      firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);

    }
  }

  // Pulls out note contents from given details object (retrieved from API)
  getNote(calendarDate, calendarDetailData) {

    // When debugging, note details
    errorHandler.logInfo("getNote - \ncalendarDate: " + calendarDate + "\n" + "calendarDetailData: " + calendarDetailData);

    // Create return variable and init with blank result
    let result = "";

    // We are trapping errors here in cases where there is no note.
    try
    {
        // If we have data for the days array, loop through and find anything for the
        // given day (calendarDate)

        if (calendarDetailData.days.length > 0) {
          for (let x = 0; x < calendarDetailData.days.length; x++) {
            if (calendarDetailData.days[x].day == calendarDate) {

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

    // Use the name area const _months to get the name of the month
    $("#AssignmentCalendarMonthYear").text(_months[month] + ", " + year);

    // Get new date now
    let newCurrentDate = new Date(year,month,1);

    // Store new date in global
    global.currentDate = newCurrentDate;

    // If we moved months, hit the API for data for the new date
    if (months !== 0) {
      this.fetchMonth(newCurrentDate);
    }


  }



  // Create the block structure for the calendar

  createBlocks() {

    // We are going to create an array of content that we can then use in our Render method.  This method allows us
    // to dynamically generate content outside of the Render method.
    let blocks = [];

    // Remember the blocks are 1-based.  This was done to make it a little easier to detect the boundaries.  Could
    // have done it using ((x+1) % 7) as well.
    for (let x=1; x < 43; x++) {

      // Push content into array for block
      blocks.push(<div id={"AssignmentCalendarBlock"+x} className='col-1 border border-dark AssignmentCalendarBlock' key={x}><div id={"AssignmentCalendarBlock"+x+"_Day"} className='AssignmentCalendarDay'></div><div id={"AssignmentCalendarBlock"+x+"_Note"}></div></div>);

      // If we are at the week boundary, put up the correct bootstrap class for a break
      if ((x % 7) === 0)
        blocks.push(<div className="w-100"></div>);
    }

    return blocks;
  }

  // Hit the API to get information about the current month and then pass it one for insertion.  Note that this
  // is asynchronous method.  This READs the current month data only!

  async fetchMonth(newCurrentDate) {

    // Use current date unless one is passed in
    let currentDate = global.currentDate;
    if (newCurrentDate != null)
      currentDate = newCurrentDate;

    // Build REST call based on year and month
    let apiUri = cfg.server.address + ":" + cfg.server.port + "/api/calendar/" + currentDate.getFullYear() + "/" + (currentDate.getMonth()+1);

    // Trap errors here and fallback to current month in that case
    try {
      const response = await fetch(apiUri);

      const json = await response.json();

      // Populate calendar with month defaulted to the first day of the month
      this.populateCalendar(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), json);

    }
    catch(e) {
      errorHandler.logError(e);
      this.populateCalendar();
    }

  }

  // React render method.  This does the heavy lifting of writing the HTML UI
  render() {

    return (

        <div id="AssignmentCalendar" className="container">

          <div id="AssignmentCalendarNav" className="row">
            <div id="AssigmentCalendarLeft" className="col-1 text-center">
              <i className='fas fa-arrow-alt-circle-left AssignmentCalendarHover' onClick={this.monthBack.bind(this)}></i>
            </div>
            <div id="AssignmentCalendarMonthYear" className="col-5 text-center"></div>
            <div id="AssignmentCalendarRight" className="col-1 text-center">
              <i className="fas fa-chevron-circle-right AssignmentCalendarHover" onClick={this.monthForward.bind(this)}></i>
            </div>
          </div>
          <div className="w-100"></div>
          <div id="AssignmentCalendarGrid" className="row">
            <div className="col-1 calendarheader">Sun</div>
            <div className="col-1 calendarheader">Mon</div>
            <div className="col-1 calendarheader">Tue</div>
            <div className="col-1 calendarheader">Wed</div>
            <div className="col-1 calendarheader">Thu</div>
            <div className="col-1 calendarheader">Fri</div>
            <div className="col-1 calendarheader">Sat</div>

            <div className="w-100"></div>

            {this.createBlocks()}

          </div>
      </div>);
  }
}



export default AssignmentCalendar;
