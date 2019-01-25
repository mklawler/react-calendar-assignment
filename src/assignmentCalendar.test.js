
// IMPORTS
import AssignmentCalendar from './assignmentCalendar';


/* GET NOTE TESTS */


test('Pull Note For Good Day', () => {
    expect(AssignmentCalendar.getNote(1,{"month":"1","days":[{"day":"1","note":"Sample Note"}]})).toBe("Sample Note");
});

test('Pull Note For Bad Day', () => {
    expect(AssignmentCalendar.getNote(2,{"month":"1","days":[{"day":"1","note":"Sample Note"}]})).toBe("");
});

test('Pull Note - Data Missing Month', () => {
    expect(AssignmentCalendar.getNote(2,{"days":[{"day":"1","note":"Sample Note"}]})).toBe("");
});

test('Pull Note - Blank Data', () => {
    expect(AssignmentCalendar.getNote(2,{})).toBe("");
});

test('Pull Note - Undefined Data', () => {
    expect(AssignmentCalendar.getNote(2,undefined)).toBe("");
});


/* FETCH MONTH TESTS */
test('Fetch Month - Good Date', done => {

    function callback(date) {
        expect(date).toEqual(new Date(2019,1,1));
        done();
    }

    AssignmentCalendar.fetchMonth(new Date(2019,1,21), callback);
});

test('Fetch Month - Bad Date', done => {

    function callback(date) {

    }

    function errorCallBack(err) {
        expect(err).toBeDefined();
        done();
    }

    AssignmentCalendar.fetchMonth("2/31/2019", callback)
        .catch(err => errorCallBack(err));
});

test('Fetch Month - Undefined Date', done => {

    function callback(date) {

    }

    function errorCallBack(err) {
        expect(err).toBeDefined();
        done();
    }

    AssignmentCalendar.fetchMonth(undefined, callback)
        .catch(err => errorCallBack(err));
});


test('Fetch Month - Good Result', done => {

    function callback(date, data) {
        expect(data).toBeDefined();
        done();
    }

    AssignmentCalendar.fetchMonth(new Date(2019,1,21), callback);
});







