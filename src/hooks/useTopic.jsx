import { useState, useRef } from 'react';
const TOPIC = {
  Normal: 'normal',
  NES: 'nes',
};
const linkId = 'nes-css-link';
let linkElement = document.getElementById(linkId);
const useTopic = () => {
  const topic = useRef('NES');
  const setTopic = (value) => {
    topic.value = value;
  };
  function dispatchTopic(action) {
    if (action === TOPIC.NES) {
      setTopic(action);
      useNES();
    } else if (action === TOPIC.Normal) {
      setTopic(action);
      useNormal();
    } else {
      throw console.error('没有这个主题');
    }
  }
  const SelectComponent = () => (
    <div className={`${topic.value}-select`}>
      <select required id="default_select" value={topic.value} onChange={(e) => dispatchTopic(e.target.value)}>
        {Object.values(TOPIC).map((item, index) => {
          return (
            <option value={item} key={index}>
              {item}
            </option>
          );
        })}
      </select>
    </div>
  );
  const useNES = () => {
    linkElement = document.createElement('link');
    linkElement.id = linkId;
    linkElement.rel = 'stylesheet';
    linkElement.href = './node_modules/nes.css/css/nes.min.css';
    document.head.appendChild(linkElement);
    changeFont();
  };
  const useNormal = () => {
    if (linkElement) {
      linkElement.parentNode.removeChild(linkElement);
    }
    changeFont();
  };
  function changeFont() {
    document.body.style.fontFamily = `var(--font-${topic.value})`;
  }
  return { topic: topic.value, TOPIC, dispatchTopic, SelectComponent };
};

export default useTopic;
