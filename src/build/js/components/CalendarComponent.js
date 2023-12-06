import _ from 'lodash';
import $globals from "./utils/GlobalStorageComponent";
import ScheduleComponent from "./ScheduleComponent";

export const name = "calendar";

const CalendarComponent = () => ({
  // Set reusable states/values in global Alpine store
  initGlobals() {
    return {
      monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      currentDate: 0,
      currentMonth: 0,
      currentYear: 1990,
    }
  },
  init() {
    let today = this.today()
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
    let scheduleList = _.get(ScheduleComponent().getScheduleList(), `_x_${$globals().currentYear}._x_${$globals().currentMonth}`)
    let lastDay = new Date($globals().currentYear, $globals().currentMonth + 1, 0)
    let calendarHTML = ""
    let dateBeingProcessed = 1

    for (let week = 1; week <= 6; week++) {
      let weekHTML = '<tr>'
      for (let weekday = 1; weekday <= 7; weekday++) {
        let calendarDate = new Date(year, month, dateBeingProcessed)
        if (weekday <= calendarDate.getDay()) {
          weekHTML += `<td scope="col" class="p-3 text-center"><span></span></td>`
          continue
        }

        let highlightTodayClass = this.datesAreOnSameDay(this.today(), calendarDate) ? "active" : ""
        let schedules = _.get(scheduleList, `_x_${calendarDate.getDate()}`)
        if (typeof(schedules) !== "undefined" && schedules !== null && schedules.length > 0) {
          highlightTodayClass += " has-schedules"
        }

        weekHTML += `
          <td scope="col" class="p-3 text-center">
            <span onclick="schedulesForGivenDate(this.dataset.date)" class="p-3 rounded-lg cursor-pointer ${highlightTodayClass}" data-date="${calendarDate.getDate()}">${calendarDate.getDate()}</span>
          </td>
        `
        dateBeingProcessed++

        if (dateBeingProcessed > lastDay.getDate()) {
          week = 999
          break;
        }
      }
      weekHTML += '</tr>'
      calendarHTML += weekHTML
    }

    ScheduleComponent().syncScheduleHTML()
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
    let today = this.today()
    $globals().currentMonth = today.getMonth()
    $globals().currentYear = today.getFullYear()
    $globals().currentDate = today.getDate()
    this.renderCalendar($globals().currentYear, $globals().currentMonth)
  }
});

// Had to create a window function because function within component is being called at the time of rendering the HTML itself
window.schedulesForGivenDate = function (date) {
  $globals().currentDate = date
  ScheduleComponent().renderSchedules()
};

export default CalendarComponent;