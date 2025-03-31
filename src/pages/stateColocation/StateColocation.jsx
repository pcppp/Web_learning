import React from 'react';
function sleep(time) {
  const done = Date.now() + time;
  while (done > Date.now()) {
    // sleep...
  }
}

// imagine that this slow component is actually slow because it's rendering a
// lot of data (for example).
function SlowComponent({ time, onChange }) {
  sleep(time);
  return (
    <div>
      Wow, that was <input value={time} type="number" onChange={(e) => onChange(Number(e.target.value))} />
      ms slow
    </div>
  );
}

function DogName({ time, dog, onChange }) {
  return (
    <div>
      <label htmlFor="dog">Dog Name</label>
      <br />
      <input id="dog" value={dog} onChange={(e) => onChange(e.target.value)} />
      <p>{dog ? `${dog}'s favorite number is ${time}.` : 'enter a dog name'}</p>
    </div>
  );
}
function DogName2({ time }) {
  const [dog, setDog] = React.useState('');
  return (
    <div>
      <label htmlFor="dog">Dog Name</label>
      <br />
      <input id="dog" value={dog} onChange={(e) => setDog(e.target.value)} />
      <p>{dog ? `${dog}'s favorite number is ${time}.` : 'enter a dog name'}</p>
    </div>
  );
}
function StateColocation() {
  // this is "global state"
  // 更改高层的状态时,react必须检查(重新渲染)同层和低层次的每个组件
  // 这里不希望SlowComponent每次都被重新渲染导致卡顿,所以降低DOG的层次
  const [dog, setDog] = React.useState('');
  const [time, setTime] = React.useState(200);
  return (
    <div>
      <p style={{ color: 'red' }}>BAD:</p>
      <DogName time={time} dog={dog} onChange={setDog} />
      <SlowComponent time={time} onChange={setTime} />
      <p style={{ color: 'red' }}>GOOD:</p>
      <DogName2 time={time} />
    </div>
  );
}
export default StateColocation;
