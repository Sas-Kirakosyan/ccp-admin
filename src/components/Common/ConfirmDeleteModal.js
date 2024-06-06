import Swal from 'sweetalert2/dist/sweetalert2.js';

const ConfirmDeleteModal = (text) =>
  Swal.fire({
    title: '',
    text: text,
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    animation: false,
    buttonsStyling: false,
    customClass: {
      container: 'rounded-0',
      popup: 'rounded-0',
      confirmButton: 'btn btn-primary btn-sm mr-3',
      cancelButton: 'btn btn-secondary btn-sm',
    },
  });

export default ConfirmDeleteModal;
