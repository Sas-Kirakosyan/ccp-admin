import React, { Component } from 'react';
import { Tooltip } from 'reactstrap';

class TooltipItem extends Component {
  // static propTypes { content: PropTypes.string }
  state = {
    _id:
      'id4tooltip_' +
      new Date().getUTCMilliseconds() +
      (Math.floor(Math.random() * 10) + 1),
    tooltipOpen: false,
  };
  toggle = () => this.setState({ tooltipOpen: !this.state.tooltipOpen });

  render() {
    return [
      <Tooltip
        {...this.props}
        isOpen={this.state.tooltipOpen}
        toggle={this.toggle}
        target={this.state._id}
        key="1"
      >
        {this.props.content}
      </Tooltip>,
      React.cloneElement(React.Children.only(this.props.children), {
        id: this.state._id,
        key: '2',
      }),
    ];
  }
}

export default TooltipItem;
