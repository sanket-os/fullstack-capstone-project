import { useEffect, useState } from 'react';
import moment from "moment";
import { Button, message, Table } from "antd";
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/loaderSlice';
import { getAllMovies } from "../../api/movie";
import MovieForm from './MovieForm';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DeleteMovieModal from './DeleteMovieModal';
import { mapErrorToMessage } from "../../utils/errorMapper";


const MovieTable = () => {
    const [movies, setMovies] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [formType, setFormType] = useState("add");

    const dispatch = useDispatch();

    const tableHeadings = [
        {
            key: "poster",
            title: "Poster",
            dataIndex: "poster",
            render: (_, data) => {
                return (
                    <img
                        src={data?.poster}
                        alt="Movie Poster"
                        style={{ objectFit: "cover", borderRadius: "4px" }}
                        width="75"
                        height="115"
                    />
                );
            },
        },

        {
            title: "Movie Name",
            dataIndex: "movieName",
        },

        {
            title: "Description",
            dataIndex: "description",
        },

        {
            title: "Duration",
            dataIndex: "duration",
            render: (text) => {
                return `${text} Min`;
            },
        },

        {
            title: "Genre",
            dataIndex: "genre",
            render: (genres) => genres.join(", "),
        },

        {
            title: "Language",
            dataIndex: "language",
            render: (langs) => langs.join(", "),
        },

        {
            title: "Release Date",
            dataIndex: "releaseDate",
            render: (_, data) => {
                return moment(data.releaseDate).format("MM-DD-YYYY");
            },
        },
        {
            title: "Actions",
            render: (_, data) => {
                return (
                    <div className='d-flex gap-10'>
                        <Button
                            onClick={() => {
                                // IMPORTANT: clone before modifying (no mutation)
                                const movieForEdit = {
                                    ...data,
                                    releaseDate: moment(data.releaseDate).format("YYYY-MM-DD"),
                                };


                                setSelectedMovie(movieForEdit);
                                setFormType("edit");
                                setIsModalOpen(true);
                            }}
                        >
                            <EditOutlined />
                        </Button>


                        <Button
                            danger
                            onClick={() => {
                                setIsDeleteModalOpen(true);
                                setSelectedMovie(data);
                            }}
                        >
                            <DeleteOutlined />
                        </Button>
                    </div>
                );
            },
        },
    ];

    const getData = async () => {
        try {
            dispatch(showLoading());

            const response = await getAllMovies();
            setMovies(response?.data);
           
        } catch (error) {
            message.error(mapErrorToMessage(error));
        } finally {
            dispatch(hideLoading());
        }
    };

    useEffect(() => {
        getData();
    }, []);



    return (
        <div style={{ borderRadius: "8px", padding: "5px" }}>
            <div className='d-flex justify-content-end mb-3'>
                <Button
                    onClick={() => {
                        setFormType("add");
                        setSelectedMovie(null);
                        setIsModalOpen(true);
                    }}
                >
                    Add Movie
                </Button>
            </div>


            <Table rowKey="_id" columns={tableHeadings} dataSource={movies} />


            {isModalOpen && (
                <MovieForm
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    FetchMovieData={getData}
                    formType={formType}
                    selectedMovie={selectedMovie}
                    setSelectedMovie={setSelectedMovie}
                />
            )}
            

            {isDeleteModalOpen && (
                <DeleteMovieModal
                    isDeleteModalOpen={isDeleteModalOpen}
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                    selectedMovie={selectedMovie}
                    setSelectedMovie={setSelectedMovie}
                    FetchMovieData={getData}
                />
            )}
        </div>
    );
}

export default MovieTable;