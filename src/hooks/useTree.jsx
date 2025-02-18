import { useRef, useEffect } from 'react';
const useTree = (initialData) => {
  // 使用 useRef 保存树实例
  const treeInstance = useRef(new Tree(initialData));

  // // 初始化树实例
  // if (!treeInstance.current) {
  //   const savedTree = localStorage.getItem('tree');
  //   treeInstance.current = savedTree ? new Tree(JSON.parse(savedTree)) : new Tree(initialData);
  // }

  // // 每次更新后保存到 localStorage
  // useEffect(() => {
  //   localStorage.setItem('tree', JSON.stringify(treeInstance.current));
  // }, [treeInstance.current]);

  // 返回树实例
  return treeInstance.current;
};
export default useTree;
class Tree {
  constructor(data) {
    this.data = data;
    this.children = [];
  }
  getChildren() {
    return this.children;
  }
  getChildByData(data) {
    this.children.forEach((item) => {
      if (item.data === data) {
        return item;
      }
    });
    return null;
  }
  insertChild(data) {
    let child = this.getChildByData(data);
    if (child) {
      child.data = data;
    } else {
      child = new Tree(data);
      this.children.push(child);
    }
    return child;
  }
}
