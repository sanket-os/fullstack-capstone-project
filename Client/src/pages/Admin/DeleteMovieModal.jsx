import { message, Modal } from "antd";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import { deleteMovie } from "../../api/movie";
import { mapErrorToMessage } from "../../utils/errorMapper";

const DeleteMovieModal = ({
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedMovie,
    setSelectedMovie,
    FetchMovieData
}) => {
    const dispatch = useDispatch();

    const handleOk = async () => {
        try {
            dispatch(showLoading());

            const movieId = selectedMovie._id;
            await deleteMovie({ movieId });

            message.success("Movie deleted successfully");
            FetchMovieData();

        } catch (error) {
            message.error(mapErrorToMessage(error));
        } finally {
            setIsDeleteModalOpen(false);
            setSelectedMovie(null);
            dispatch(hideLoading());
        }
    };

    const handleCancel = () => {
        setIsDeleteModalOpen(false);
        setSelectedMovie(null);
    };

    return (
        <Modal
            title="Delete Movie"
            open={isDeleteModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Delete"
            okButtonProps={{ danger: true }}
        >
            <p className="pt-3 fs-18">
                Are you sure you want to delete this movie {selectedMovie?.movieName}?
            </p>


            <p className="pb-3 fs-18">
                This action can't be undone and you'll lose this movie data
            </p>
        </Modal>
    );
};

export default DeleteMovieModal;