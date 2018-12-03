import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  LayoutAnimation,
  TouchableOpacity,
  FlatList,
} from 'react-native';

class ExpandableList extends Component {
  constructor(props) {
    super(props);
    const map = new Map();
    this.state = {
      memberOpened: map,
    };
  }

  onPress = (i) => {
    const {
      headerOnPress,
    } = this.props;
    const {
      memberOpened,
    } = this.state;

    this.setState((state) => {
      const memberOpenedValue = new Map(state.memberOpened);
      memberOpenedValue.set(i, !memberOpened.get(i)); // toggle
      return { memberOpened: memberOpenedValue };
    });

    if (headerOnPress) {
      headerOnPress(i, !(memberOpened.get(i)));
    }

    LayoutAnimation.easeInEaseOut();
  };

  renderMember = (member) => {
    const { renderItem } = this.props;
    return member.map(memberItem => (
      <View key={`member_${memberItem.id}`}>
        {renderItem ? renderItem(memberItem) : null}
      </View>
    ));
  };

  renderSection = ({ item }) => {
    const { renderSectionHeaderX, headerKey, memberKey } = this.props;
    const { memberOpened } = this.state;
    const memberList = !item[memberKey] || !memberOpened.get(item.id) ? [] : item[memberKey];

    return (
      <View>
        <TouchableOpacity onPress={() => this.onPress(item.id)}>
          { renderSectionHeaderX ? renderSectionHeaderX(item[headerKey]) : null}
        </TouchableOpacity>
        { this.renderMember(memberList) }
      </View>
    );
  };

  render() {
    const { dataSource } = this.props;
    const { memberOpened } = this.state;
    return (
      <FlatList
        {...this.props}
        keyExtractor={item => item.id}
        data={dataSource}
        renderItem={this.renderSection}
        extraData={memberOpened}
        scrollEnabled={false}
      />
    );
  }
}

ExpandableList.propTypes = {
  dataSource: PropTypes.object.isRequired,
  headerKey: PropTypes.string,
  memberKey: PropTypes.string,
  renderItem: PropTypes.func,
  renderSectionHeaderX: PropTypes.func,
  headerOnPress: PropTypes.func,
  isOpen: PropTypes.bool,
  openOptions: PropTypes.array,
};

ExpandableList.defaultProps = {
  headerKey: 'header',
  memberKey: 'member',
  isOpen: false,
};

export default ExpandableList;