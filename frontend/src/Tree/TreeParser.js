import TreeMember from './TreeMember/TreeMember';

class TreeParser {
  constructor(datalist, root) {
    this.datalist = datalist;
    this.memberlist = {};
    this.nextMemberId = 0;
    this.dereferenceMemberDataRecursively(root);
  }

  getDatalist() {
    return this.datalist;
  }

  getMemberlist() {
    return this.memberlist;
  }

  getNextMemberId() {
    return this.nextMemberId;
  }

  dereferenceMemberData(item) {
    this.nextMemberId++;
    if (typeof item !== 'string') return item.props === undefined ? item : item.props;

    const defaultMember = { id: item, name: item, partners: [], children: {} };

    if (this.datalist == null) return defaultMember;

    for (const key in this.datalist) {
      const member = this.datalist[key];
      const data = member.props === undefined ? member : member.props;
      if (data.id !== item) continue;

      delete this.datalist[key]; // Efficiency measure - assumes there is only one referral per person
      return data; // Return the found member data
    }

    return defaultMember; // Return default if no member is found
  }

  dereferenceMemberDataRecursively(item) {
    const root = this.dereferenceMemberData(item);

    // Recursively handle partners
    root.partners = (root.partners || []).map(partner_item => this.dereferenceMemberDataRecursively(partner_item));

    const children = {};
    for (let i = 0; i < root.partners.length; i++) {
      const partner = root.partners[i];
      const childrenArray = Array.isArray(root.children) ? root.children[i] : root.children[partner.id];

      if (!childrenArray || childrenArray.length === 0) continue;

      children[partner.id] = childrenArray.map(child_item => this.dereferenceMemberDataRecursively(child_item));
    }
    root.children = children;

    // Store the current root member in the memberlist
    this.memberlist[root.id] = root;

    // Store partners in the memberlist
    for (const partner of root.partners) {
      this.memberlist[partner.id] = partner;
    }

    // Store children in the memberlist
    for (const childId in children) {
      children[childId].forEach(child => {
        this.memberlist[child.id] = child;
      });
    }

    return root;
  }
}

export default TreeParser;