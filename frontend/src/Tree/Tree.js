import React from 'react';
import TreeMember from './TreeMember/TreeMember';
import TreeParser from './TreeParser';

class Tree extends React.Component {

  constructor(props) {
    super(props);

    // нормализуем все возможные представления дерева в едином вложенном объекте данных
    var parser = new TreeParser(props.datalist, props.root);
    this.memberlist = parser.getMemberlist();
    this.nextMemberId = parser.getNextMemberId();
    this.state = {
      memberlist: this.memberlist,
      rootid: this.props.root,
      membercount: parseInt(this.memberlist.length)
    }

    // привязка обработчиков
    this.handleAddPartner = this.handleAddPartner.bind(this);
    this.handleAddChild = this.handleAddChild.bind(this);
    this.handleMemberEdit = this.handleMemberEdit.bind(this);
    this.handleMemberDelete = this.handleMemberDelete.bind(this);
  }

  // ПРОСТЫЕ ГЕТТЕРЫ //

  getNextMemberId(memberlist) {
    if (memberlist === undefined) memberlist = this.state.memberlist;
    let ids = Object.keys(memberlist);
    let append = 1;
    let prepend = 'new_member_';
    while (ids.indexOf(prepend + append) >= 0) append++;
    return prepend + append;
  }

  getNewMember(name, id) {
    return {'id': id, 'name': name, 'partners':[], 'children':[]}
  }

  // ОБРАБОТЧИКИ //

  handleMemberEdit(member_id, data) {
    this.setState(function (prev_state, props) {
      var memberlist = {...prev_state.memberlist};
      memberlist[member_id].name = data.name;
      return { 'memberlist': memberlist };
    });
  }

  handleMemberDelete(member_id) {
    this.setState((prev_state) => {
      const memberlist = { ...prev_state.memberlist };
      const member = memberlist[member_id];

      // Check if the member exists
      if (!member) {
        alert('Член семьи не найден');
        return prev_state;
      }

      // Check if the member has partners
      if (member.partners.length > 0) {
        alert('Невозможно удалить участника с партнерами');
        return prev_state;
      }

      // Remove from parent's partners
      Object.keys(memberlist).forEach((id) => {
        const currentMember = memberlist[id];
        if (currentMember.partners) {
          currentMember.partners = currentMember.partners.filter(partner => partner !== member_id);
        }
      });

      // Remove the member from the memberlist
      delete memberlist[member_id];

      return { memberlist };
    });
  }

  handleAddPartner(root_id) {
    this.setState(function (prev_state, props) {
      let memberlist = {...prev_state.memberlist};
      let new_id = this.getNextMemberId(memberlist);
      let new_member = this.getNewMember('Новый партнер', new_id);
      memberlist[new_member.id] = new_member;
      memberlist[root_id].partners.push(new_member);
      memberlist[root_id].children[new_member.id] = [];
      return { 'memberlist': memberlist };
    });
  }

  handleAddChild(root_id, partner_id) {
    this.setState(function (prev_state, props) {
      let memberlist = {...prev_state.memberlist};
      let new_id = this.getNextMemberId(memberlist);
      let new_member = this.getNewMember('Новый ребенок', new_id);
      memberlist[new_member.id] = new_member;
      if (!Array.isArray(memberlist[root_id].children[partner_id])) {
        memberlist[root_id].children[partner_id] = [];
      }
      memberlist[root_id].children[partner_id].push(new_member);
      return { 'memberlist': memberlist };
    });
  }

  // РЕНДЕРЕРЫ //

  render() {
    return <TreeMember
        {...this.state.memberlist[this.state.rootid]}
        onAddPartner={this.handleAddPartner}
        onAddChild={this.handleAddChild}
        onEdit={this.handleMemberEdit}
        onDelete={this.handleMemberDelete}
        parentPosition={this.state.position}
    />;
  }
}

export default Tree;