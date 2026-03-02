import { useEffect, useState, useMemo } from 'react';
import moment from "moment";
import { Button, message, Table, Input, Tag } from "antd";
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/loaderSlice';
import { getAllMovies } from "../../api/movie";
import MovieForm from './MovieForm';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import DeleteMovieModal from './DeleteMovieModal';
import { mapErrorToMessage } from "../../utils/errorMapper";


const MovieTable = () => {
    const [movies, setMovies] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [formType, setFormType] = useState("add");

    const dispatch = useDispatch();

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

      /* ================= SEARCH FILTER ================= */
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) =>
      movie.movieName
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  }, [movies, searchText]);

   
 /* ================= TABLE COLUMNS ================= */
  const columns = [
    {
      key: "poster",
      title: "Poster",
      dataIndex: "poster",
      width: 110,
      render: (_, data) => (
        <img
          src={data?.poster}
          alt="Poster"
          style={{
            objectFit: "cover",
            borderRadius: 8,
          }}
          width="70"
          height="100"
        />
      ),
    },
    {
      title: "Movie Name",
      dataIndex: "movieName",
      render: (text) => (
        <span style={{ fontWeight: 500 }}>{text}</span>
      ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      width: 120,
      render: (text) => `${text} min`,
    },
    {
      title: "Genre",
      dataIndex: "genre",
      render: (genres) =>
        genres?.map((g, index) => (
          <Tag key={index}>{g}</Tag>
        )),
    },
    {
      title: "Language",
      dataIndex: "language",
      render: (langs) =>
        langs?.map((l, index) => (
          <Tag key={index} color="blue">
            {l}
          </Tag>
        )),
    },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      width: 140,
      render: (_, data) =>
        moment(data.releaseDate).format("MMM DD, YYYY"),
    },
    {
      title: "Actions",
      width: 120,
      render: (_, data) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              const movieForEdit = {
                ...data,
                releaseDate: moment(data.releaseDate).format("YYYY-MM-DD"),
              };
              setSelectedMovie(movieForEdit);
              setFormType("edit");
              setIsModalOpen(true);
            }}
          />

          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setIsDeleteModalOpen(true);
              setSelectedMovie(data);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "var(--space-5)",
        borderRadius: 12,
        border: "1px solid #e5e7eb",
      }}
    >
      {/* ===== HEADER BAR ===== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-4)",
        }}
      >
        <Input
          placeholder="Search movies..."
          prefix={<SearchOutlined />}
          style={{ width: 260 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setFormType("add");
            setSelectedMovie(null);
            setIsModalOpen(true);
          }}
        >
          Add Movie
        </Button>
      </div>

      {/* ===== TABLE ===== */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={filteredMovies}
        pagination={{
          pageSize: 6,
          showSizeChanger: false,
        }}
      />

      {/* ===== MODALS ===== */}
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
};

export default MovieTable;