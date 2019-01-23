const cal = require('./assignmentCalendar');

// Get Note Test From JSON
test('Pull Note For Given Day', () => {
    let calendar = new cal.default();
    expect(calendar.getNote(1,{"month":"1","days":[{"day":"1","note":"Sample Note"}]})).toBe("Sample Note");
});