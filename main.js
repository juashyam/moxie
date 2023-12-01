import './style.css'

import Alpine from "alpinejs";
import persist from '@alpinejs/persist'

import App from "./src/build/js/App";
import * as CalendarComponent from "./src/build/js/components/CalendarComponent";
import * as ScheduleComponent from "./src/build/js/components/ScheduleComponent";
import RangeComponent from "./src/build/js/components/utils/RangeComponent";
import GlobalStorageComponent from "./src/build/js/components/utils/GlobalStorageComponent";

window.App = App;

// Bind Alpine to App
App.mount(Alpine)
  .magic([
    RangeComponent,
    GlobalStorageComponent
  ])
  .usePlugins([persist])
  .register([
    CalendarComponent,
    ScheduleComponent
  ])
  .ready(() => {
    // do stuff when DOM is ready
  })
  .start();