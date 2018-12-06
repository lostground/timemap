// TODO: relegate these URLs entirely to environment variables
const EVENT_DATA_URL = `${process.env.SERVER_ROOT}${process.env.EVENT_EXT}`
const CATEGORY_URL = `${process.env.SERVER_ROOT}${process.env.CATEGORY_EXT}`
const TAG_TREE_URL = `${process.env.SERVER_ROOT}${process.env.TAG_TREE_EXT}`
const NARRATIVE_URL = `${process.env.SERVER_ROOT}${process.env.NARRATIVE_EXT}`
const SITES_URL = `${process.env.SERVER_ROOT}${process.env.SITES_EXT}`
const eventUrlMap = (event) => `${process.env.SERVER_ROOT}${process.env.EVENT_DESC_ROOT}/${(event.id) ? event.id : event}`

/*
* Create an error notification object
* Types: ['error', 'warning', 'good', 'neural']
*/
function makeError (type, id, message) {
  return {
    type: 'error',
    id,
    message: `${type} ${id}: ${message}`
  }
}

export function fetchDomain () {
  let notifications = []

  function handleError (domainType) {
    return () => {
      notifications.push({
        message: `Something went wrong fetching ${domainType}. Check the URL or try disabling them in the config file.`,
        type: 'error'
      })
      return []
    }
  }

  return dispatch => {
    dispatch(toggleFetchingDomain())
    const promises = []

    const eventPromise = fetch(EVENT_DATA_URL)
      .then(response => response.json())
      .catch(handleError('events'))

    const catPromise = fetch(CATEGORY_URL)
      .then(response => response.json())
      .catch(handleError('categories'))

    const narPromise = fetch(NARRATIVE_URL)
      .then(response => response.json())
      .catch(handleError('narratives'))

    let sitesPromise = Promise.resolve([])
    if (process.env.features.USE_SITES) {
      sitesPromise = fetch(SITES_URL)
        .then(response => response.json())
        .catch(handleError('sites'))
    }

    let tagsPromise
    if (process.env.features.USE_TAGS) {
      tagsPromise = fetch(TAG_TREE_URL)
        .then(response => response.json())
        .catch(handleError('tags'))
    }

    return Promise.all([eventPromise, catPromise, narPromise,
      sitesPromise, tagsPromise])
      .then(response => {
        dispatch(toggleFetchingDomain())
        const result = {
          events: response[0],
          categories: response[1],
          narratives: response[2],
          sites: response[3],
          tags: response[4],
          notifications
        }
        return result
      })
      .catch(err => {
        dispatch(fetchError(err.message))
        dispatch(toggleFetchingDomain())
      })
  };
}

export const FETCH_ERROR = 'FETCH_ERROR'
export function fetchError(message) {
  return {
    type: FETCH_ERROR,
    message,
  }
}

export const UPDATE_DOMAIN = 'UPDATE_DOMAIN'
export function updateDomain(domain) {
  return {
    type: UPDATE_DOMAIN,
    domain: {
      events: domain.events,
      categories: domain.categories,
      tags: domain.tags,
      sites: domain.sites,
      narratives: domain.narratives,
      notifications: domain.notifications
    }
  }
}

export function fetchEvents (events) {
  return dispatch => {
    dispatch(toggleFetchingEvents())
    const urls = events.map(eventUrlMap)
    return Promise.all(
      urls.map(url => fetch(url)
        .then(response => response.json())
      )
    )
      .then(json => {
        dispatch(toggleFetchingEvents())
        return json
      })
  }
}

export const UPDATE_HIGHLIGHTED = 'UPDATE_HIGHLIGHTED'
export function updateHighlighted(highlighted) {
    return {
        type: UPDATE_HIGHLIGHTED,
        highlighted: highlighted
    }
}

export const UPDATE_SELECTED = 'UPDATE_SELECTED'
export function updateSelected(selected) {
    return {
        type: UPDATE_SELECTED,
        selected: selected
    }
}

export const UPDATE_DISTRICT = 'UPDATE_DISTRICT'
export function updateDistrict(district) {
    return {
        type: UPDATE_DISTRICT,
        district
    }
}

export const UPDATE_TAGFILTERS = 'UPDATE_TIMEFILTERS'
export function updateTagFilters(tag) {
    return {
        type: UPDATE_TAGFILTERS,
        tag
    }
}

export const UPDATE_TIMERANGE = 'UPDATE_TIMERANGE';
export function updateTimeRange(timerange) {
    return {
        type: UPDATE_TIMERANGE,
        timerange
    };
}

export const UPDATE_NARRATIVE = 'UPDATE_NARRATIVE';
export function updateNarrative(narrative) {
  return {
    type: UPDATE_NARRATIVE,
    narrative
  }
}

export const RESET_ALLFILTERS = 'RESET_ALLFILTERS'
export function resetAllFilters() {
    return {
        type: RESET_ALLFILTERS
    }
}

// UI

export const TOGGLE_FETCHING_DOMAIN = 'TOGGLE_FETCHING_DOMAIN'
export function toggleFetchingDomain() {
    return {
        type: TOGGLE_FETCHING_DOMAIN
    }
}

export const TOGGLE_FETCHING_EVENTS = 'TOGGLE_FETCHING_EVENTS'
export function toggleFetchingEvents() {
    return {
        type: TOGGLE_FETCHING_EVENTS
    }
}

export const TOGGLE_LANGUAGE = 'TOGGLE_LANGUAGE';
export function toggleLanguage(language) {
    return {
        type: TOGGLE_LANGUAGE,
        language,
    }
}

export const CLOSE_TOOLBAR = 'CLOSE_TOOLBAR';
export function closeToolbar() {
    return {
        type: CLOSE_TOOLBAR
    }
}

export const TOGGLE_INFOPOPUP = 'TOGGLE_INFOPOPUP';
export function toggleInfoPopup() {
    return {
        type: TOGGLE_INFOPOPUP
    }
}

export const TOGGLE_NOTIFICATIONS = 'TOGGLE_NOTIFICATIONS'
export function toggleNotifications() {
    return {
        type: TOGGLE_NOTIFICATIONS
    }
}

export const TOGGLE_MAPVIEW = 'TOGGLE_MAPVIEW';
export function toggleMapView(layer) {
  return {
    type: TOGGLE_MAPVIEW,
    layer
  }
}
