import { message, Modal } from "antd";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import { deleteTheatre } from "../../api/theatre";
import { mapErrorToMessage } from "../../utils/errorMapper";


const DeleteTheatreModal = ({
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedTheatre,
    setSelectedTheatre,
    fetchTheatreData,
}) => {
    const dispatch = useDispatch();

    const handleOk = async () => {
        try {
            dispatch(showLoading());

            const theatreId = selectedTheatre._id;
            await deleteTheatre({ theatreId: theatreId });

            message.success("Theatre deleted successfully");
            fetchTheatreData();

        } catch (error) {
            message.error(mapErrorToMessage(error));
        } finally {
            dispatch(hideLoading());
            setIsDeleteModalOpen(false);
            setSelectedTheatre(null);
        }
    };


    const handleCancel = () => {
        setIsDeleteModalOpen(false);
        setSelectedTheatre(null);
    };


    return (
        <div>
            <Modal
                title="Delete Theatre?"
                open={isDeleteModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p className="pt-3 fs-18">
                    Are you sure you want to delete this theatre {selectedTheatre.name}?
                </p>


                <p className="pb-3 fs-18">
                    This action can't be undone and you'll lose this theatre data.
                </p>
            </Modal>
        </div>
    );
};

export default DeleteTheatreModal;