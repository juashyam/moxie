export const App = {
  // container that holds all our components
  components: [],
  readyCallback: null,
  status: "waiting",
  $alpine: null,
  plugins: [],
  magics: [],
  globals: [],
  // mounts alpine as a module to this app container
  mount(alpine) {
    this.$alpine = alpine;
    window.Alpine = alpine;
    return this;
  },
  start() {
    if (!this.$alpine) {
      this.$alpine = window.Alpine;
    }

    // wait until the DOM is ready
    if (document.readyState != "loading") {
      // now load all registered components
      this.loadAllRegisteredComponents();

      // if we've got a ready callback, now is the time to execute it.
      if (this.readyCallback) {
        this.readyCallback();
      }

      this.status = "started";

      // load Alpine-Plugins
      this.loadPlugins();

      // load Alpine-Magic Functions
      this.loadMagics();

      // load global storage
      this.loadGlobals();

      // start Alpine
      this.$alpine.start();
    } else {
      // If DOM is not ready, wait until it is and continue.
      document.addEventListener("DOMContentLoaded", () => {
        this.loadAllRegisteredComponents;
      });
    }
    return this;
  },
  // register an array of alpine plugins
  usePlugins(plugins) {
    plugins.forEach((plugin) => {
      this.usePlugin(plugin);
    });
    return this;
  },
  // register a plugin to be used with alpine
  usePlugin(plugin) {
    this.plugins.push(plugin);
    return this;
  },
  // initialize all registered alpine plugins
  loadPlugins() {
    this.plugins.forEach((plugin) => {
      this.$alpine.plugin(plugin);
    });
  },
  // Registers an array of components into the components-container
  register(components) {
    if (Array.isArray(components)) {
      components.forEach((item, i) => {
        if (item.childComponents) {
          this.register(item.childComponents);
        }
        this.components.push(item);
      });
      // Only for debugging component registration
      window.components = this.components;
    }
    return this;
  },
  // returns true if a given selector exists in the DOM
  hasComponent(selector) {
    return document.querySelectorAll(selector).length > 0;
  },
  // loads all components that have been registered into the components-container.
  loadAllRegisteredComponents() {
    this.components.forEach((module, i) => {
      this.loadComponent(module);
    });
    return this;
  },
  // loads a given component and executes its code.
  loadComponent(module) {
    let options;

    if (Array.isArray(module)) {
      options = module[1];
      module = module[0];
    }
    // Components must export a name and a default value
    if (module.name && module.default) {
      // if the component exists, load it
      if (module.isBare) {
        this.loadBareComponent(module.default, options);
      } else {
        if (module.selector && this.hasComponent(module.selector)) {
          this.loadAlpineComponent(module.name, module.default, options);
        } else {
          // TODO: Not sure, why it will be loaded even if it does not?
          // If so, remove this condition...
          this.loadAlpineComponent(module.name, module.default, options);
        }
      }
    }
  },
  loadBareComponent(component, options = null) {
    // check if component is an object
    if (Object.prototype.toString.call(component) === "[object Object]") {
      Object.keys(component).forEach((key) => {
        this.loadBareComponent(component[key], options);
      });
    } else {
      if (options) {
        component.options = options;
        component(options);
      } else {
        component();
      }
    }
  },
  loadAlpineComponent(name, component, options = null) {
    if (Object.prototype.toString.call(component) === "[object Object]") {
      Object.keys(component).forEach((key) => {
        this.loadAlpineComponent(key.toLowerCase(), component[key], options);
      });
    } else {
      if (options) {
        component.options = options;
        this.$alpine.data(name, component(options));
      } else {
        this.$alpine.data(name, component);
      }
      this.registerGlobals(component);
    }
  },
  // Register magic functions
  magic(magics) {
    if (Array.isArray(magics)) {
      magics.forEach((item, i) => {
        this.magics.push(item);
      });
    }
    return this;
  },
  loadMagics() {
    this.magics.forEach((module, i) => {
      this.$alpine.magic(module.name, () => {
        return (...params) => module(...params)
      });
    });
    return this;
  },
  registerGlobals(component) {
    if (typeof component().initGlobals === "function") {
      this.globals.push(component().initGlobals())
    }
  },
  loadGlobals() {
    let globalStorage = {}
    this.globals.forEach((data, i) => {
      globalStorage = {...globalStorage, ...data}
    });
    this.$alpine.store('globals', globalStorage);
  },
  // Ready-State callback
  ready(fn) {
    this.readyCallback = fn;
    return this;
  },
};

export default App;