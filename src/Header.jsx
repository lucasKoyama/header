import { Squash as Hamburger } from 'hamburger-react';
import PropTypes from 'prop-types';
import './Header.css';
import { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.css';

function Header({navBar, color}) {
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

  const createNavBar = (li) => (
    Array.isArray(li[1])
      ? <li className="sub-menu-name">
          { li[0] }
          <i className="fa-solid fa-chevron-right arrow" />
          <ul
            className="sub-menu"
            style={ { backgroundColor: color } }
          >
            {
              li.map((item, index) => (
                index === 0 ? false : createNavBar(item)
              ))
            }
          </ul>
        </li>
      : <li><a href={li[1]}>{ li[0] }</a></li>
  );

  const navBarItems = convertObjectToArray(navBar)
    .map((li) => createNavBar(li));

  return (
    <header
      className={`header ${isHeaderVisible ? 'header-visible' : 'header-hidden'}`}
      style={ { backgroundColor: color } }
    >
      <div className='logo'>
        <img src="" alt="LOGO" />
      </div>
      <nav>
        { <ul className="main-menu"> { navBarItems } </ul> }
      </nav>
      <div className='cellphone-menu'>
        <Hamburger/>
      </div>
    </header>
  );
}

Header.propTypes = ({
  navBar: PropTypes.array,
}).isRequired;

export default Header;