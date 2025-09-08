import { NavLink, useRoutes, Outlet } from 'react-router';
import { useState } from 'react';
import routers from '@/router';
import { ButtonPro } from '../../components/ButtonPro';
import { getNavLink } from '../../router';
const links = getNavLink();

export default function MyNavLink() {
  const [isMovedDown, setIsMovedDown] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const handleDivClick = (e) => {
    if (e) {
      if (e.target.innerText === currentTag) return;
      setCurrentTag(e.target.innerText);
      setIsMovedDown(!isMovedDown);
    } else {
      setIsMovedDown(!isMovedDown);
    }
  };
  return (
    <>
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-amber-200 p-4">
          <Outlet />
        </div>
        <div
          className={`absolute inset-0 z-10 min-h-screen bg-amber-500 pt-15 pr-60 pl-60 transition-transform duration-500 ease-in-out ${isMovedDown ? 'translate-y-[100vh]' : 'translate-y-0'} `}>
          {/* 操作框 */}
          <div
            className={`fixed top-[-15px] left-0 z-10 h-[30px] w-full rounded-t-2xl bg-amber-700 hover:bg-amber-800`}
            onClick={() => {
              handleDivClick();
            }}></div>
          {/* 标题 */}
          <div className="mb-12 text-center">
            <h1 className={'mb-2 text-4xl font-bold tracking-wider text-white'}>LIST</h1>
            <div className="mx-auto h-1 w-24 rounded-full bg-white opacity-50"></div>
          </div>
          {/* 列表List */}
          <div
            className={`text-1xl grid grid-cols-2 gap-8 font-semibold sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`}>
            {links.map((link) => {
              return (
                <NavLink key={link.path} to={link.path} className={'w-full'}>
                  <ButtonPro
                    className={`h-full w-full ${currentTag === link.title ? 'outline-2' : ''}`}
                    onClick={(e) => {
                      handleDivClick(e);
                    }}>
                    {link.title}
                  </ButtonPro>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
