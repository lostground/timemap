import {
  createSelector
} from 'reselect'

// Input selectors
export const getEvents = state => state.domain.events
export const getLocations = state => state.domain.locations
export const getCategories = state => state.domain.categories
export const getNarratives = state => state.domain.narratives
export const getSites = (state) => {
  if (process.env.features.USE_SITES) return state.domain.sites
  return []
}
export const getNotifications = state => state.domain.notifications;
export const getTagTree = state => state.domain.tags;
export const getTagsFilter = state => state.app.filters.tags;
export const getTimeRange = state => state.app.filters.timerange;

/**
* Some handy helpers
*/
const parseTimestamp = ts => d3.timeParse("%Y-%m-%dT%H:%M:%S")(ts);

/**
 * Given an event and all tags,
 * returns true/false if event has any tag that is active
 */
function isTaggedIn(event, tagFilters) {
  if (event.tags) {
    const tagsInEvent = event.tags.split(",");
    const isTagged = tagsInEvent.some((tag) => {
      return tagFilters.find(tF => (tF.key === tag && tF.active));
    });
    return isTagged;
  } else {
    return false
  }
}

/*
* Returns true if no tags are selected
*/
function isNoTags(tagFilters) {
  return (
    tagFilters.length === 0
    || !process.env.features.USE_TAGS
    || tagFilters.every(t => !t.active)
  );
}

/**
 * Given an event and a time range,
 * returns true/false if the event falls within timeRange
 */
function isTimeRangedIn(event, timeRange) {
  return (
    timeRange[0] < parseTimestamp(event.timestamp)
    && parseTimestamp(event.timestamp) < timeRange[1]
  );
}

/**
 * Of all available events, selects those that fall within the time range,
 * and if TAGS are being used, select them if their tags are enabled
 */
export const selectEvents = createSelector(
    [getEvents, getTagsFilter, getTimeRange],
    (events, tagFilters, timeRange) => {

      return events.reduce((acc, event) => {
        const isTagged = isTaggedIn(event, tagFilters) || isNoTags(tagFilters);
        const isTimeRanged = isTimeRangedIn(event, timeRange);

        if (isTimeRanged && isTagged) {
          const eventClone = Object.assign({}, event);
          acc[event.id] = eventClone;
        }

        return acc;
    }, []);
});

/**
 * Of all available events, selects those that fall within the time range,
 * and if TAGS are being used, select them if their tags are enabled
 */
export const selectNarratives = createSelector(
    [getEvents, getNarratives, getTagsFilter, getTimeRange],
    (events, narrativeMetadata, tagFilters, timeRange) => {

      const narratives = {};
      events.forEach((evt) => {
        const isTagged = isTaggedIn(evt, tagFilters) || isNoTags(tagFilters);
        const isTimeRanged = isTimeRangedIn(evt, timeRange);
        const isInNarrative =  evt.narrative;

        if (isTimeRanged && isTagged && isInNarrative) {
          if (!narratives[evt.narrative]) {
            narratives[evt.narrative] = { id: evt.narrative, steps: [], byId: {} };
          }
          narratives[evt.narrative].steps.push(evt);
          narratives[evt.narrative].byId[evt.id] = { next: null, prev: null };
        }
      });

      Object.keys(narratives).forEach((key) => {
        const steps = narratives[key].steps;

        steps.sort((a, b) => {
          return (parseTimestamp(a.timestamp) > parseTimestamp(b.timestamp));
        });

        steps.forEach((step, i) => {
          narratives[key].byId[step.id].next = (i < steps.length - 2) ? steps[i + 1] : null;
          narratives[key].byId[step.id].prev = (i > 0) ? steps[i - 1] : null;
        });

        narratives[key] = Object.assign(narrativeMetadata.find(n => n.id === key), narratives[key]);
      });

      return Object.values(narratives);
});

/**
 * Of all the filtered events, group them by location and return a list of
 * locations with at least one event in it, based on the time range and tags
 */
export const selectLocations = createSelector(
  [selectEvents],
  (events) => {

    const selectedLocations = {};
    events.forEach(event => {
      const location = event.location;

      if (selectedLocations[location]) {
        selectedLocations[location].events.push(event);
      } else {
        selectedLocations[location] = {
          label: location,
          events: [event],
          latitude: event.latitude,
          longitude: event.longitude
        }
      }
    })

    return Object.values(selectedLocations);
  }
);


/*
* Select categories, return them as a list
*/
export const selectCategories = createSelector(
  [getCategories],
  (categories) => categories
);


/**
 * Given a tree of tags, return those tags as a list
 * Each node has been aware of its depth, and given an 'active' flag
 */
export const selectTagList = createSelector(
  [getTagTree],
  (tags) => {
    const tagList = [];
    let depth = 0;
    function traverseNode(node, depth) {
      node.active = (!node.hasOwnProperty('active')) ? false : node.active;
      node.depth = depth;

      if (node.active) tagList.push(node)

      if (Object.keys(node.children).length > 0) {
        Object.values(node.children).forEach((childNode) => {
          traverseNode(childNode, depth + 1);
        });
      }
    }
    if (tags && tags !== undefined) {
      if (tags.key && tags.children) traverseNode(tags, depth)
    }
    return tagList;
  }
)
