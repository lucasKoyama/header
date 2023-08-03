import { Squash as Hamburger } from 'hamburger-react';
import PropTypes from 'prop-types';
import './Header.css';
import { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.css';

function Header({navBar, logoSrc, color}) {
  const [isHeaderVisible, setHeaderVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const desktopWidth = screen.width >= 1024;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingDown = currentScrollPos > prevScrollPos;
      const shouldHeaderHide = isScrollingDown && currentScrollPos > 20;
      setHeaderVisible(!shouldHeaderHide);
      setShowMenu(!shouldHeaderHide && showMenu);
      setPrevScrollPos(currentScrollPos);
      if (!shouldHeaderHide) {
        const subMenus = document.querySelectorAll('.sub-menu');
        subMenus.forEach((subMenu) => subMenu.style.display = 'none');
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, showMenu]);

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

  const createNavBar = (li) => {
    const toggleSubMenu = (event) => {
      if (!desktopWidth) {
        event.preventDefault();
        const subMenu = event.currentTarget.querySelector('.sub-menu');
        if (subMenu) {
          subMenu.style.display = subMenu.style.display === 'none' ? 'block' : 'none';
        }
        // Stop the event propagation to prevent it from affecting parent menus
        event.stopPropagation();
      }
    };
  
    return (
      Array.isArray(li[1])
        ? (
          <li
            className="sub-menu-name"
            onClick={ toggleSubMenu }
          >
            <div>{li[0]}<i className="fa-solid fa-chevron-right arrow" /></div>
            <ul className="sub-menu" style={{ backgroundColor: color }}>
              { li.map((item, index) => index === 0 ? false : createNavBar(item)) }
            </ul>
          </li>
        )
        : <li><a href={li[1]}>{li[0]}</a></li>
    );
  };
  
  const navBarItems = convertObjectToArray(navBar).map((li) => createNavBar(li));

  return (
    <header
      className={`header ${isHeaderVisible ? 'show' : 'hide'}`}
      style={ { backgroundColor: color } }
    >
      <div className='logo'>
        <img src={ logoSrc } alt="LOGO" />
      </div>
      <nav className={desktopWidth ? 'show' : showMenu ? 'show' : 'hide'}>
        { <ul className="main-menu"> { navBarItems } </ul> }
      </nav>
      <div className='cellphone-menu'>
        <Hamburger toggled={ showMenu } rounded onToggle={ toggled => setShowMenu(toggled) }/>
      </div>
    </header>
  );
}

Header.propTypes = ({
  navBar: PropTypes.array,
}).isRequired;

export default Header;