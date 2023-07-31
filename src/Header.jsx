import { Squash as Hamburger } from 'hamburger-react';
import PropTypes from 'prop-types';
import './Header.css';
import { useEffect, useState } from 'react';

function Header({navBar}) {
  const [isHeaderVisible, setHeaderVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingDown = currentScrollPos > prevScrollPos;
      const shouldHeaderHide = isScrollingDown && currentScrollPos > 20;
      setHeaderVisible(!shouldHeaderHide);
      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const convertObjectToArray = (obj) => {
    const keys = Object.keys(obj);
    const result = [];
    keys.forEach((key) => {
      const value = obj[key];
      if (typeof value === 'string') {
        result.push([key, value]);
      } else {
        const subArray = convertObjectToArray(value);
        result.push([key, ...subArray]);
      }
    });
    return result;
  }

  const createNavBar = (li, firstLiClass) => (
    Array.isArray(li[1])
      ? <li className={ firstLiClass }>
          { li[0] }
          <ul className="drop-down">
            {
              li.map((item, index) => (
                index === 0 ? false : createNavBar(item, 'drop-down-name')
              ))
            }
          </ul>
        </li>
      : <li><a href={li[1]}>{ li[0] }</a></li>
  );

  const navBarItems = convertObjectToArray(navBar)
    .map((li) => createNavBar(li, 'main-drop-down'));

  return (
    <header className={`header ${isHeaderVisible ? 'header-visible' : 'header-hidden'}`}>
      <div className='logo'>
        <img src="" alt="LOGO" />
      </div>
      <nav>
        { <ul className="nav-bar"> { navBarItems } </ul> }
      </nav>
      <Hamburger/>
    </header>
  );
}

Header.propTypes = ({
  navBar: PropTypes.array,
}).isRequired;

export default Header;