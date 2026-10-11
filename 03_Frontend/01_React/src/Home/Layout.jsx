import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

function Layout({ isDark, toggle }) {
  return (
    <div className={`flex flex-col justify-between min-h-screen ${isDark ? "dark-mode" : "light-mode"}`}>
      <div className="">
        <Header isDark={isDark} toggle={toggle}/>
      </div>
      <div className="">
        <main className="flex-grow">
          <Outlet/>
        </main>
      </div>
      <div className="">
        <Footer />
      </div>
    </div>
  )
}

export default Layout;
