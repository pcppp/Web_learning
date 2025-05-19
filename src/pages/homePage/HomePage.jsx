import { NavLink, useRoutes } from 'react-router';

const links = [
  {
    title: '井字棋',
    url: '/tictactoe',
  },
  {
    title: '虚拟列表',
    url: '/virtualList',
  },
  {
    title: '上传',
    url: '/myUpload',
  },
  {
    title: 'websocket',
    url: '/websocket',
  },
  {
    title: '状态托管',
    url: '/stateColocation',
  },
];

export default function MyNavLink() {
  return (
    <>
      <a className="nes-btn" href="#">
        Normal
      </a>
      <button type="button" className="nes-btn is-primary">
        Primary
      </button>
      <button type="button" className="nes-btn is-success">
        Success
      </button>
      <button type="button" className="nes-btn is-warning">
        Warning
      </button>
      <button type="button" className="nes-btn is-error">
        Error
      </button>
      <button type="button" className="">
        Disabled
      </button>

      <ul className="text-3xl">
        {links.map((link) => {
          return (
            <li key={link.url}>
              <NavLink to={link.url}>{link.title}</NavLink>
            </li>
          );
        })}
      </ul>
    </>
  );
}
