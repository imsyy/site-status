import { useEffect } from 'react';
import Link from './link';

function Header() {

  useEffect(() => {
    document.title = window.Config.SiteName;
  }, []);

  return (
    <div id='header'>
      <div className='container'>
        <h1 className='logo'>{window.Config.SiteName}</h1>
        <div className='navi'>
          {window.Config.Navi.map((item, index) => (
            <Link key={index} to={item.url} text={item.text} />
          ))}
        </div>
      </div>
      <div className='status-top'>
        <div className='status-tip' id='status-tip'></div>
        <p className='status-text' id='status-text'>站点状态加载中</p>
        <p className='status-text' id='status-down'>部分站点无法运行</p>
        <p className='status-time' id='status-time-up'>上次更新于&nbsp;<span id='status-last-time'>00&nbsp;:&nbsp;00</span>&emsp;|&emsp;检测频率&nbsp;5&nbsp;分钟</p>
      </div>
    </div>
  );
}

export default Header;
