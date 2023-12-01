export const name = "schedule";

const ScheduleCaleldar = () => ({
  title: "Upcoming Schedule",
  // Set reusable states/values in global Alpine store
  initGlobals() {
    return {
      schedules: "WIP"
    }
  },
});

export default ScheduleCaleldar;