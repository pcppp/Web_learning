const Tree = ({ treeData, keyProp, displayProp }) => {
  let treeList = [];
  let relevantHeight = 0;
  const renderLineData = (data, keyProp, style) => {
    return (
      <div key={data[keyProp]} style={style}>
        {data[displayProp]}
      </div>
    );
  };
  const renderTreeList = (treeData, keyProp, level = 0) => {
    treeData.forEach((child) => {
      treeList.push(
        renderLineData(child, keyProp, {
          width: '100%',
          fontSize: '16px',
          left: level * 30 + 'px',
          top: relevantHeight + 'px',
          position: 'absolute',
        })
      );
      relevantHeight += 20;
      if (child.children.length > 0) {
        renderTreeList(child.children, keyProp, level + 1);
      }
    });
  };
  renderTreeList(treeData.children, keyProp);
  return <div style={{ position: 'relative' }}>{treeList}</div>;
};

export default Tree;
