const initial = {
  /*
  * The Domain or 'domain' of this state refers to the tree of data
  *  available for render and display.
  * Selections and filters in the 'app' subtree will operate the domain
  *   in mapStateToProps of the Dashboard, and deterimne which items
  *   in the domain will get rendered by React
  */
  domain: {
    events: [],
    narratives: [],
    locations: [],
    categories: [],
    sites: [],
    tags: {},
    notifications: [],
  },

  /*
  * The 'app' subtree of this state determines the data and information to be
  *   displayed.
  * It may refer to those the user interacts with, by selecting,
  *   fitlering and so on, which ultimately operate on the data to be displayed.
  * Additionally, some of the 'app' flags are determined by the config file
  *   or by the characteristics of the client, browser, etc.
  */
  app: {
    error: null,
    highlighted: null,
    selected: [],
    narrative: null,
    filters: {
      timerange: [
          d3.timeParse("%Y-%m-%dT%H:%M:%S")("2014-08-22T12:00:00"),
          d3.timeParse("%Y-%m-%dT%H:%M:%S")("2014-08-27T12:00:00")
      ],
      tags: [],
      categories: [],
      views: {
        events: true,
        coevents: false,
        routes: false,
        sites: true
      },
    },
    base_uri: 'http://127.0.0.1:8000/', // Modify accordingly on production setup.
    isMobile: (/Mobi/.test(navigator.userAgent)),
    language: 'en-US',
    mapAnchor: process.env.MAP_ANCHOR,
    zoomLevels: [{
      label: '3 años',
      duration: 1576800,
      active: false
    },
    {
      label: '3 meses',
      duration: 129600,
      active: false
    },
    {
      label: '3 días',
      duration: 4320,
      active: true
    },
    {
      label: '12 horas',
      duration: 720,
      active: false
    },
    {
      label: '2 horas',
      duration: 120,
      active: false
    },
    {
      label: '30 min',
      duration: 30,
      active: false
    },
    {
      label: '10 min',
      duration: 10,
      active: false
    }],
    features: {
      USE_TAGS: process.env.features.USE_TAGS,
      USE_SEARCH: process.env.features.USE_SEARCH
    },
    flags: {
      isFetchingDomain: false,
      isFetchingEvents: false,

      isCardstack: true,
      isInfopopup: false,
      isNotification: true
    }
  },

  /*
  * The 'ui' subtree of this state refers the state of the cosmetic
  *   elements of the application, such as color palettes of categories
  *   as well as dom elements to attach SVG
  */
  ui: {
    style: {
      categories: {
        default: 'red',
        // Add here other categories to differentiate by color, like:
        alpha: '#00ff00',
        beta: '#ff0000',
        other: 'yellow'
      },

      narratives: {
        default: {
          style: 'dotted',                  // ['dotted', 'solid']
          opacity: 0.4,                     // range between 0 and 1
          stroke: 'red',               // Any hex or rgb code
          strokeWidth: 2
        },
        narrative_1: {
          style: 'solid',                  // ['dotted', 'solid']
          opacity: 0.4,                     // range between 0 and 1
          stroke: 'yellow',               // Any hex or rgb code
          strokeWidth: 2
        }
      }
    },
    dom: {
      timeline: "timeline",
      timeslider: "timeslider",
      map: "map"
    },
  }
};

export default initial;
