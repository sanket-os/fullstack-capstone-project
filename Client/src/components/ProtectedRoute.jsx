import { Layout, Menu, message } from "antd";
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

const ProtectedRoute = ({ children }) => {

    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getValidUser = async () => {
        try {
            dispatch(showLoading());

            const response = await GetCurrentUser();
            console.log('API Response:', response); // Debug log

            if (response.success) {
                dispatch(setUser(response?.data));
            } else {
                message.warning(response?.message || 'Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user:', error); // Debug log
            message.error(error.message || 'Something went wrong');
        } finally {
            dispatch(hideLoading());
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("tokenForBMS");
        if (token) {
            getValidUser();
        } else {
            navigate("/login");
        }
    }, [navigate]);

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
                        if (user.role === "admin") {
                            navigate("/admin", { replace: true });
                        } else if (user.role === "partner") {
                            navigate("/partner", { replace: true });
                        } else {
                            navigate("/profile", { replace: true });
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

        {
            key: "profile",
            label: `${user ? user.name : ""}`,
            icon: <UserOutlined />,
            children: [
                // {
                //     key: "roleProfile",
                //     label: (
                //         <span
                //             onClick={() => {
                //                 if (user.role === "admin") {
                //                     navigate("/admin", { replace: true });
                //                 } else if (user.role === "partner") {
                //                     navigate("/partner", { replace: true });
                //                 } else {
                //                     navigate("profile", { replace: true });
                //                 }
                //             }}
                //         >
                //             My Profile
                //         </span>
                //     ),
                //     icon: <ProfileOutlined />,
                // },
                {
                    key: "logout",
                    label: (
                        <Link
                            to="/login"
                            onClick={() => {
                                localStorage.removeItem("tokenForBMS");
                            }}
                        >
                            Logout
                        </Link>
                    ),
                    icon: <LogoutOutlined />,
                },
            ],
        },

    ];

    return (
        <>
            <Layout>
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

                <Content style={{ maxHeight: "100%" }}>{children}</Content>

                <Footer
                    style={{
                        textAlign: "center",
                        background: "#001529",
                        color: "white",
                        marginTop: "auto",
                    }}
                >
                    BookMyShow ©{new Date().getFullYear()} Created by Sam
                </Footer>
            </Layout>
        </>
    );
};

export default ProtectedRoute;