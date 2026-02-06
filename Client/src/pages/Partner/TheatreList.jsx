import { message, Table, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import { getAllTheatres } from "../../api/theatre";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import TheatreForm from "./TheatreForm";
import ShowModal from "./ShowModal";
import DeleteTheatreModal from "./DeleteTheatreModal";

const TheatreList = () => {
    const dispatch = useDispatch();

    const [theatres, setTheatres] = useState([]);
    const [selectedTheatre, setSelectedTheatre] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isShowModalOpen, setIsShowModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formType, setFormType] = useState("add");

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Phone Number",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Status",
            dataIndex: "isActive",
            render: (_, data) => {
                if (data.isActive) {
                    return `Approved`;
                } else {
                    return `Pending/ Blocked`;
                }
            },
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (_, data) => {
                return (
                    <div className="d-flex align-items-center gap-10">
                        <Button
                            onClick={() => {
                                setIsModalOpen(true);
                                setFormType("edit");
                                setSelectedTheatre(data);
                            }}
                        >
                            <EditOutlined />
                        </Button>

                        <Button
                            onClick={() => {
                                setIsDeleteModalOpen(true);
                                setSelectedTheatre(data);
                            }}
                            danger
                        >
                            <DeleteOutlined />
                        </Button>

                        {data.isActive &&
                            <Button
                                onClick={() => {
                                    setIsShowModalOpen(true);
                                    setSelectedTheatre(data);
                                }}
                            >
                                + Shows
                            </Button>}
                    </div>
                );
            },
        },
    ];

    const getData = async () => {
        try {
            dispatch(showLoading());
            const response = await getAllTheatres();

            if (response.success === true) {
                setTheatres(response.data)
            } else {
                message.warning(response?.message || "Failed to fetch theatres");
            }
        } catch (error) {
            message.error(error?.message || "Something went wrong");
        } finally {
            dispatch(hideLoading());
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            <div className="d-flex justify-content-end mb-3">
                <Button
                    type="primary"
                    onClick={() => {
                        setIsModalOpen(true);
                        setSelectedTheatre(null);
                        setFormType("add");
                    }}
                >
                    Add Theatre
                </Button>
            </div>

            <Table rowKey="_id" dataSource={theatres} columns={columns} />

            {isModalOpen && (
                <TheatreForm
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    selectedTheatre={selectedTheatre}
                    setSelectedTheatre={setSelectedTheatre}
                    fetchTheatreData={getData}
                    formType={formType}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteTheatreModal
                    isDeleteModalOpen={isDeleteModalOpen}
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                    selectedTheatre={selectedTheatre}
                    setSelectedTheatre={setSelectedTheatre}
                    fetchTheatreData={getData}
                />
            )}

            {isShowModalOpen && (
                <ShowModal
                    isShowModalOpen={isShowModalOpen}
                    setIsShowModalOpen={setIsShowModalOpen}
                    selectedTheatre={selectedTheatre}
                    setSelectedTheatre={setSelectedTheatre}
                ></ShowModal>
            )}
        </div>
    );
};

export default TheatreList;