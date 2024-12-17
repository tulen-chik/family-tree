import { TreenodeWidth, TreenodeMargin } from './../TreeStylesShared';

export function getLinkerProps(p, pindex, m) {
  const childrowWidth = getChildRowWidth(p, m);
  const parentrowWidth = getParentRowWidth(m);

  const childbracket = m.children[p]?.slice(0, -1) || [];
  const childbracketWidth = childbracket.reduce((sum, member) => sum + getMemberWidth(member), 0);

  const precedingParentsWidth = m.partners
      .slice(0, pindex)
      .reduce((sum, partner) => sum + getMemberWidth(partner), 0);

  const precedingChildlistsWidth = m.partners
      .slice(0, pindex)
      .reduce((outerSum, partner) =>
              outerSum + (m.children[partner.id]?.reduce((innerSum, member) => innerSum + getMemberWidth(member), 0) || 0),
          0);

  const followingChildlists = m.partners.slice(pindex + 1);
  const followingChildlistsWidth = followingChildlists.reduce((outerSum, partner) =>
          outerSum + (m.children[partner.id]?.reduce((innerSum, member) => innerSum + getMemberWidth(member), 0) || 0),
      0);

  const positionOfFirstNodeInChildlistBlock = (
      getMemberWidth(m) - precedingChildlistsWidth - followingChildlistsWidth - childrowWidth
  ) / 2;

  // Set left edge of linker
  let setleft = precedingChildlistsWidth + positionOfFirstNodeInChildlistBlock + getNodeWidth(m) / 2 + childbracketWidth / 2;

  // Set right edge of linker
  let setright = (getMemberWidth(m) - parentrowWidth) / 2 + precedingParentsWidth + getNodeWidth(m);

  const leftToRight = setleft > setright;
  if (leftToRight) {
    [setleft, setright] = [setright, setleft]; // Swap values
  }

  const setwidth = Math.abs(setright - setleft);

  return {
    childbracketWidth: childbracketWidth,
    firstNodeOffset: positionOfFirstNodeInChildlistBlock,
    setleft: setleft,
    setwidth: setwidth,
    left_to_right: leftToRight
  };
}

export function getNodeWidth(m) {
  return TreenodeWidth + TreenodeMargin * 2;
}

export function getChildlistArray(m) {
  return m.partners.length === 0 ? [] : m.partners.map(p => m.children[p.id] || []);
}

export function getMemberWidth(m) {
  return Math.max(getParentRowWidth(m), getFullChildlistsWidth(m));
}

export function getParentRowWidth(m) {
  return getNodeWidth(m) + m.partners.reduce((sum, partner) => sum + getMemberWidth(partner), 0);
}

export function getChildRowWidth(pid, m) {
  if (!m.children[pid]) return 0;
  return m.children[pid].reduce((sum, member) => sum + getParentRowWidth(member), 0);
}

export function getFullChildlistsWidth(m) {
  return getChildlistArray(m).reduce((a, cul) =>
          a + cul.reduce((b, cli) => b + getMemberWidth(cli), 0),
      0);
}