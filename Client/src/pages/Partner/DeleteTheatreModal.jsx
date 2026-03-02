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
      await deleteTheatre({ theatreId });

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
    <Modal
      title={<span style={{ fontWeight: 600 }}>Delete Theatre</span>}
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
          {selectedTheatre?.name}
        </p>

        <p
          style={{
            fontSize: 13,
            color: "#6b7280",
            margin: 0,
          }}
        >
          This action cannot be undone. All associated shows will also be permanently removed.
        </p>
      </div>
    </Modal>
  );
};

export default DeleteTheatreModal;