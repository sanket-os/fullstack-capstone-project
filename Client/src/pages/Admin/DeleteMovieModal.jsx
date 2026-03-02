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
            title={
                <span style={{ fontWeight: 600 }}>
                    Delete Movie
                </span>
            }
            open={isDeleteModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{
                danger: true,
                style: { borderRadius: 8 },
            }}
            cancelButtonProps={{
                style: { borderRadius: 8 },
            }}
        >
            <div style={{ marginTop: "var(--space-4)" }}>
                <p
                    style={{
                        fontSize: 14,
                        marginBottom: "var(--space-3)",
                        color: "#111827",
                    }}
                >
                    Are you sure you want to delete:
                </p>

                <p
                    style={{
                        fontWeight: 600,
                        marginBottom: "var(--space-4)",
                    }}
                >
                    {selectedMovie?.movieName}
                </p>

                <p
                    style={{
                        fontSize: 13,
                        color: "#6b7280",
                        margin: 0,
                    }}
                >
                    This action cannot be undone. All associated show data will be permanently removed.
                </p>
            </div>
        </Modal>
    );
};

export default DeleteMovieModal;