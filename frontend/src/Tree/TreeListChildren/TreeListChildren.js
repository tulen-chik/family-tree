import React from 'react';
import styled from 'styled-components';
import TreeMember from './../TreeMember/TreeMember';
import * as CommonStyles from './../TreeStylesShared';

const ChildList = styled(CommonStyles.TreeList)`
  & > li {
    position: relative;
  }

  & > li:first-child:not(:last-child)::before {
    ${CommonStyles.LinkProperties}
    height: 2em;
    width: calc(100% - ${props => props.firstNodeOffset}em - ${CommonStyles.TreenodeHalfwidth}em);
    border-right-width: 0;
    border-bottom-width: 0;
    border-top-right-radius: 0;
    top: -1em;
    left: auto;
    right: 0;
  }

  & > li:last-child:not(:first-child)::before {
    ${CommonStyles.LinkProperties}
    height: 2em;
    width: ${CommonStyles.TreenodeHalfwidth}em;
    border-left-width: 0;
    border-bottom-width: 0;
    border-top-left-radius: 0;
    top: -1em;
    left: 0;
  }

  & > li:not(:first-child):not(:last-child)::before {
    ${CommonStyles.LinkProperties}
    height: 1em;
    width: 100%;
    border-left-width: 0;
    border-right-width: 0;
    border-bottom-width: 0;
    border-radius: 0;
    top: -1em;
  }

  & > li:not(:first-child):not(:last-child)::after {
    ${CommonStyles.LinkProperties}
    height: 1em;
    width: ${CommonStyles.TreenodeHalfwidth}em;
    border-top-width: 0;
    border-left-width: 0;
    border-bottom-width: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    top: -1em;
    left: 0;
  }
`;

const ChildlistHeader = styled.h2`
  ${CommonStyles.LinkProperties}
  font-size: 1em;
  top: -3em;
  height: 1em;
  border-top-width: 0;
  text-indent: -9999px;
  box-sizing: content-box;
  margin: 0;
  margin-left: ${props => props.setleft}em;
  width: ${props => props.setwidth}em;

  ${props => props.left_to_right
      ? 'border-right-width: 0; border-top-left-radius: 0; border-bottom-right-radius: 0;'
      : 'border-left-width: 0; border-top-right-radius: 0; border-bottom-left-radius: 0;'
  }

  &::before {
    ${CommonStyles.LinkProperties}
    bottom: -${props => props.childbracketWidth === 0 ? 2 : 1}em;
    height: ${props => props.childbracketWidth === 0 ? 2 : 1}em;
    border-bottom-width: 0;
    display: block;
    ${props => props.left_to_right
        ? 'right: -1em; border-left-width: 0; border-radius: 0 0.75em 0;'
        : 'left: -1em; border-right-width: 0; border-radius: 0.75em 0;'
    }
    ${props => parseInt(props.setwidth) < 1
        ? 'width: 0; right: auto; left: auto;'
        : 'width: 1em;'
    }
  }
`;

class TreeListChildren extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
    this.state = {};
  }

  render() {
    const { members, parent, linkprops, onAddPartner, onAddChild, onEdit, onDelete } = this.props;

    if (!members || members.length === 0) return null;

    return (
        <>
          <ChildlistHeader key={`childlist_header_${parent.id}`} {...linkprops}>
            Children of <a href={`#${parent.id}`}>{parent.name}</a>
          </ChildlistHeader>
          <ChildList key={`childlist_${parent.id}`} {...linkprops} innerRef={this.listRef}>
            {members.map(member => (
                <li key={member.id}>
                  <TreeMember
                      onAddPartner={onAddPartner}
                      onAddChild={onAddChild}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      {...member}
                  />
                </li>
            ))}
          </ChildList>
        </>
    );
  }
}

export default TreeListChildren;