const useDeepEqulity = (obj1, obj2) => {
  const detectType = (data) => {
    return Object.prototype.toString.call(data).split(' ')[1].slice(0, -1).toLowerCase();
  };
  const key1 = Object.keys(obj1);
  const key2 = Object.keys(obj2);
  if (key1.length != key2.length) {
    return false;
  }
  let result = true;
  key1.forEach((attribute) => {
    if (detectType(obj1[attribute]) === 'object') {
      if (!useDeepEqulity(obj1[attribute], obj2[attribute])) {
        result = false;
        return;
      }
    } else {
      if (!(obj1[attribute] === obj2[attribute])) {
        result = false;
        return;
      }
    }
  });
  //   if (result) {
  //     console.log('obj1==obj2', obj1, obj2);
  //   } else {
  //     console.log('obj1!=obj2', obj1, obj2);
  //   }
  return result;
};
export default useDeepEqulity;
