import React, { useContext } from 'react'
import Navbar from './Navbar';
import SideMenu from './SideMenu';
import { UserContext } from '../../context/userContext';

const DashboardLayout = ({ children, activeMenu }) => {

    const { user } = useContext(UserContext);

    return (

        <div className="">
            <Navbar activeMenu={activeMenu} />

            {user && (
                <div className="flex">

                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block">
                        <SideMenu activeMenu={activeMenu} />
                    </div>

                    {/* Page Content */}
                    <div className="grow mx-5">
                        {children}
                    </div>

                </div>
            )}
        </div>
    );
};

export default DashboardLayout