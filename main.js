import './style.css'
import Alpine from "alpinejs";
import App from "./src/build/js/App";
import * as CalendarComponent from "./src/build/js/components/CalendarComponent";

window.App = App;

// Bind Alpine to App
App.mount(Alpine)
  // Register Plugins
  // .usePlugins([persist, intersect, Parent, collapse, Clipboard])
  // Register Components
  .register([
    CalendarComponent
  ])
  .ready(() => {
    // do stuff when DOM is ready
  })
  // Start App
  .start();