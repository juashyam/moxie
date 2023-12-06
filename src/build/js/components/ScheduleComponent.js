import $globals from "./utils/GlobalStorageComponent";
import _ from 'lodash';

export const name = "schedule";

const ScheduleCaleldar = () => ({
  title: "My Schedule(s)",
  storageKey: "_x_scheduleList",
  getSchedulesForDay(year = $globals().currentYear, month = $globals().currentMonth, date = $globals().currentDate, storageKey = this.storageKey) {
    let schedulesForDay = _.get(this.getScheduleList(storageKey), `_x_${year}._x_${month}._x_${date}`);
    return schedulesForDay ? schedulesForDay.reverse() : []
  },
  getScheduleList(storageKey = this.storageKey) {
    let scheduleList = localStorage.getItem(storageKey)
    return scheduleList ? JSON.parse(scheduleList) : {}
  },
  addSchedule(newSchedule) {
    let scheduleList = this.getScheduleList()

    let idx = 0
    let schedulesForDay = _.get(scheduleList, `_x_${$globals().currentYear}._x_${$globals().currentMonth}._x_${$globals().currentDate}`)
    if (typeof(schedulesForDay) !== "undefined" && schedulesForDay !== null) {
      idx = schedulesForDay.length
    }

    _.set(scheduleList, `_x_${$globals().currentYear}._x_${$globals().currentMonth}._x_${$globals().currentDate}[${idx}]`, newSchedule)
    localStorage.setItem(this.storageKey, JSON.stringify(scheduleList))

    this.syncScheduleHTML()
  },
  renderSchedules(year = $globals().currentYear, month = $globals().currentMonth, date = $globals().currentDate) {
    let scheduleList = this.getSchedulesForDay(year, month, date)
    let scheduleHTML = ''
    scheduleList.forEach((schedule) => {
      scheduleHTML += `
        <li class="p-3 pb-0 mx-auto">
          <span title="${schedule}" class="border-l-2 border-gray-300 text-gray-800 text-sm block p-3 shadow-sm truncate">${schedule}</span>
        </li>
      `
    });
    return scheduleHTML
  },
  syncScheduleHTML() {
    let scheduleListHTML = this.renderSchedules()
    var el = document.querySelector('#schedules')
    el.innerHTML = scheduleListHTML
  },
  titleCurrentDate() {
    return `[${$globals().monthNamesShort[$globals().currentMonth]} ${$globals().currentDate}, ${$globals().currentYear}]`
  }
});

export default ScheduleCaleldar;