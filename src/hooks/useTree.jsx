import { useRef, useEffect } from 'react';
import useDeepEqulity from './useDeepEquality';
const useTree = (...initialData) => {
  // 使用 useRef 保存树实例
  const treeInstance = new Tree(...initialData);

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
  return treeInstance;
};
export default useTree;
class Tree {
  constructor(data, key) {
    this.key = key;
    this.data = data;
    this.children = [];
  }
  getChildren() {
    return this.children;
  }
  getChildByData(data) {
    let result = null;
    this.children.forEach((child) => {
      if (useDeepEqulity(child.data, data)) {
        result = child;
        return;
      }
      // if (child.children.length) {
      //   const result = child.children.getChildByData(data);
      //   if (result) return result;
      // }
    });
    return result;
  }
  insertChild(data, key) {
    let child = this.getChildByData(data);
    if (child) {
      child.data = data;
      child.key = key;
    } else {
      child = new Tree(data, key);
      this.children.push(child);
    }
    return child;
  }
  deleteChild(data) {
    let child = this.getChildByData(data);
    this.children = this.children.filter((item) => {
      useDeepEqulity(item.data, child.data);
    });
  }
}
