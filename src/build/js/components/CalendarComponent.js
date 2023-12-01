import $globals from "./utils/GlobalStorageComponent";

export const name = "calendar";

const CalendarComponent = () => ({
  // Set reusable states/values in global Alpine store
  initGlobals() {
    return {
      monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      currentDate: 0,
      currentMonth: 0,
      currentYear: 1990,
    }
  },
  init() {
    var today = this.today()
    $globals().currentDate = today.getDate()
    $globals().currentMonth = today.getMonth()
    $globals().currentYear = today.getFullYear()
  },
  today() {
    return new Date()
  },
  currentMonthFullName() {
    return $globals().monthNames[$globals().currentMonth]
  },
  renderCalendar(year = $globals().currentYear, month = $globals().currentMonth) {
    var lastDay = new Date($globals().currentYear, $globals().currentMonth + 1, 0)
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
  gotoMonth(month = $globals().currentMonth) {
    if (typeof(month) !== "undefined" && month !== null) {
      $globals().currentMonth = parseInt(month) - 1
      this.renderCalendar($globals().currentYear, $globals().currentMonth)
    }
  },
  gotoYear(year = this.currentYear) {
    if (typeof(year) !== "undefined" && year !== null) {
      $globals().currentYear = parseInt(year)
      this.renderCalendar($globals().currentYear, $globals().currentMonth)
    }
  },
  gotoPrevMonth() {
    $globals().currentYear = $globals().currentMonth <= 0 ? ($globals().currentYear - 1) : $globals().currentYear
    $globals().currentMonth = $globals().currentMonth <= 0 ? 11 : ($globals().currentMonth - 1)
    this.renderCalendar($globals().currentYear, $globals().currentMonth)
  },
  gotoNextMonth() {
    $globals().currentYear = $globals().currentMonth >= 11 ? ($globals().currentYear + 1) : $globals().currentYear
    $globals().currentMonth = $globals().currentMonth >= 11 ? 0 : ($globals().currentMonth + 1)
    this.renderCalendar($globals().currentYear, $globals().currentMonth)
  },
  gotoTodayMonth() {
    var today = this.today()
    $globals().currentMonth = today.getMonth()
    $globals().currentYear = today.getFullYear()
    this.renderCalendar($globals().currentYear, $globals().currentMonth)
  }
});

export default CalendarComponent;