export const name = "calendar";

const CalendarComponent = () => ({
  monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  currentDate: 1,
  currentMonth: 1,
  currentYear: 1990,
  init() {
    var today = this.today()
    this.currentDate = today.getDate()
    this.currentMonth = today.getMonth()
    this.currentYear = today.getFullYear()
  },
  today() {
    return new Date()
  },
  currentMonthFullName() {
    return this.monthNames[this.currentMonth]
  },
  renderCalendar(year = this.currentYear, month = this.currentMonth) {
    var lastDay = new Date(this.currentYear, this.currentMonth + 1, 0)
    var calendarHTML = ""
    var dateBeingProcessed = 1

    for (let week = 1; week <= 6; week++) {
      let weekHTML = '<tr>'
      for (let weekday = 1; weekday <= 7; weekday++) {
        var calendarDate = new Date(year, month, dateBeingProcessed)
        weekHTML += '<td scope="col" class="px-6 py-3 text-center">'

        if (weekday <= calendarDate.getDay()) {
          weekHTML += '<span></span></td>'
          continue
        }

        var highlightToday = this.datesAreOnSameDay(this.today(), calendarDate) ? "font-bold p-2 border-2 border-gray-800 rounded-lg" : ""
        weekHTML += '<span class="' + highlightToday + '">' + calendarDate.getDate() + '</span></td>'
        dateBeingProcessed++

        if (dateBeingProcessed > lastDay.getDate()) {
          week = 999
          break;
        }
      }
      weekHTML += '</tr>'
      calendarHTML += weekHTML
    }
    return calendarHTML
  },
  datesAreOnSameDay(first, second) {
    return first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate()
  },
  gotoMonth(month = this.currentMonth) {
    if (typeof(month) !== "undefined" && month !== null) {
      this.currentMonth = parseInt(month) - 1
      this.renderCalendar(this.currentYear, this.currentMonth)
    }
  },
  gotoYear(year = this.currentYear) {
    if (typeof(year) !== "undefined" && year !== null) {
      this.currentYear = parseInt(year)
      this.renderCalendar(this.currentYear, this.currentMonth)
    }
  },
  gotoPrevMonth() {
    this.currentYear = this.currentMonth <= 0 ? (this.currentYear - 1) : this.currentYear
    this.currentMonth = this.currentMonth <= 0 ? 11 : (this.currentMonth - 1)
    this.renderCalendar(this.currentYear, this.currentMonth)
  },
  gotoNextMonth() {
    this.currentYear = this.currentMonth >= 11 ? (this.currentYear + 1) : this.currentYear
    this.currentMonth = this.currentMonth >= 11 ? 0 : (this.currentMonth + 1)
    this.renderCalendar(this.currentYear, this.currentMonth)
  },
  gotoTodayMonth() {
    var today = this.today()
    this.currentMonth = today.getMonth()
    this.currentYear = today.getFullYear()
    this.renderCalendar(this.currentYear, this.currentMonth)
  },
  range(start, end, step = 1) {
    let output = [];
    if (typeof end === 'undefined') {
      end = start;
      start = 0;
    }
    for (let i = start; i < end; i += step) {
      output.push(i);
    }
    return output;
  }
});

export default CalendarComponent;