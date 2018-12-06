import React from 'react';
import { connect } from 'react-redux'
import * as selectors from '../selectors'

import Card from './Card.jsx';
import copy from '../js/data/copy.json';
import {
  isNotNullNorUndefined
} from '../js/utilities.js';

class CardStack extends React.Component {

  constructor(props) {
    super(props);
  }

  renderCards() {
    if (this.props.selected.length > 0) {
      return this.props.selected.map((event) => {
        return (
          <Card
            event={event}
            language={this.props.language}
            isLoading={this.props.isLoading}
            getNarrativeLinks={this.props.getNarrativeLinks}
            getCategoryGroup={this.props.getCategoryGroup}
            getCategoryColor={this.props.getCategoryColor}
            getCategoryLabel={this.props.getCategoryLabel}
            highlight={this.props.onHighlight}
            select={this.props.onSelect}
          />
        );
      });
    }
    return '';
  }

  renderLocation() {
    let locationName = copy[this.props.language].cardstack.unknown_location;
    if (this.props.selected.length > 0) {
      if (isNotNullNorUndefined(this.props.selected[0].location)) {
        locationName = this.props.selected[0].location;
      }
      return (<p className="header-copy">in:<b>{` ${locationName}`}</b></p>)
    }
    return '';
  }

  renderCardStackHeader() {
    const header_lang = copy[this.props.language].cardstack.header;

    return (
      <div
        id='card-stack-header'
        className='card-stack-header'
        onClick={() => this.props.onToggle('TOGGLE_CARDSTACK')}
      >
        <button className="side-menu-burg is-active"><span></span></button>
        <p className="header-copy top">
          {(this.props.isLoading)
            ? copy[this.props.language].loading
            : `${this.props.selected.length} ${header_lang}`}
        </p>
        {/*(this.props.isLoading) ? '' : this.renderLocation()*/}
      </div>
    )
  }

  renderCardStackContent() {
    return (
      <div id="card-stack-content" className="card-stack-content">
        <ul>
          {(this.props.isLoading)
            ? <Card language={this.props.language} isLoading={true} />
            : this.renderCards()
          }
        </ul>
      </div>
    );
  }

  render() {
    if (this.props.selected.length > 0) {
      return (
        <div id="card-stack" className={`card-stack ${this.props.isCardstack ? '' : ' folded'}`}>
          {this.renderCardStackHeader()}
          {this.renderCardStackContent()}
        </div>
      );
    }
    return <div/>;
  }
}

function mapStateToProps(state) {
  return {
    selected: state.app.selected,
    language: state.app.language,
    isCardstack: state.app.flags.isCardstack,
    isLoading: state.app.flags.isFetchingEvents
  }
}

export default connect(mapStateToProps)(CardStack)
