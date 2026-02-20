import { Layout, Menu } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import React, { useEffect } from "react";
import {
    HomeOutlined,
    LogoutOutlined,
    ProfileOutlined,
    UserOutlined,
} from "@ant-design/icons";

import { Link, useNavigate } from "react-router-dom";
import { GetCurrentUser } from "../api/user";
import { useSelector, useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { setUser } from "../redux/userSlice";
import { axiosInstance } from "../api/index";
import { mapErrorToMessage } from "../utils/errorMapper";


const ProtectedRoute = ({ children }) => {

    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [authChecked, setAuthChecked] = React.useState(false);

    useEffect(() => {
        getValidUser();
    }, []);


    const getValidUser = async () => {
        try {
            dispatch(showLoading());

            const response = await GetCurrentUser();
            console.log('API Response:', response); // Debug log

            dispatch(setUser(response?.data));

        } catch (error) {
            /**
                * If session invalid → redirect silently
                * No scary error message needed
            */
            dispatch(setUser(null));
            navigate("/login", { replace: true });

            // Optional debug:
            console.warn("Session expired:", mapErrorToMessage(error));
        } finally {
            dispatch(hideLoading());
            setAuthChecked(true); // ✅ mark auth complete
        }
    };


    const handleLogout = async () => {
        try {
            await axiosInstance.post("/users/logout");
        } catch (e) {
            // Even if logout fails, force logout locally
        } finally {
            dispatch(setUser(null));
            navigate("/login", { replace: true });
            window.location.reload(); // optional but useful in payment apps
        }
    };


    const navItems = [
        {
            key: "home",
            label: (
                <span
                    onClick={() => {
                        navigate("/");
                    }}>
                    Home
                </span>
            ),
            icon: <HomeOutlined />,
        },


        {
            key: "roleProfile",
            label: (
                <span
                    onClick={() => {
                        if (user?.role === "admin") {
                            navigate("/admin", { replace: true });
                        } else if (user.role === "partner") {
                            navigate("/partner", { replace: true });
                        } else {
                            navigate("/mybookings", { replace: true });
                        }
                    }}
                >
                    {user?.role === "admin" && "Movie Management"}
                    {user?.role === "partner" && "Theatre Management"}
                    {user?.role === "user" && "My Bookings"}
                </span>
            ),
            icon: <ProfileOutlined />
        },

        // Property	                    Behavior
        // replace: false (default)	    Add new history entry
        // replace: true	            Replace current entry (no back navigation to previous page)

        // after you login going back to the login page is undesirable hence replace: true is good option here

        {
            key: "profile",
            label: `${user ? user.name : ""}`,
            icon: <UserOutlined />,
            children: [
                {
                    key: "logout",
                    label: <Link onClick={handleLogout}>Logout</Link>,
                    icon: <LogoutOutlined />,
                },
            ],
        },

    ];

    if (!authChecked) return null;

    return (
        <>
            <Layout style={{ minHeight: "100vh" }}>
                <Header
                    className="d-flex justify-content-between"
                    style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 1,
                        width: "100%",
                        alignItems: "center",
                    }}
                >
                    <h3 className="text-white m-0" style={{ color: "white" }}>
                        BookMyShow
                    </h3>
                    <Menu theme="dark" mode="horizontal" items={navItems} />
                </Header>


                <Content style={{ minHeight: "calc(100vh - 128px)" }}>
                    {children}
                </Content>


                <Footer
                    style={{
                        textAlign: "center",
                        background: "#001529",
                        color: "white",
                        width: "100%",
                    }}
                >
                    BookMyShow ©{new Date().getFullYear()} Created by Sam
                </Footer>
            </Layout>
        </>
    );
};

export default ProtectedRoute;

