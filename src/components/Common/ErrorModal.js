import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ERROR_OCCURRED_MSG } from '../../data/const/errorMessages';

const ErrorModal = (message) =>
  Swal.fire({
    title: '',
    text: message || ERROR_OCCURRED_MSG,
    showCancelButton: false,
    confirmButtonText: 'Ok',
    animation: false,
    buttonsStyling: false,
    width: 'auto',
    customClass: {
      container: 'rounded-0',
      popup: 'rounded-0 px-0 py-3',
      content: 'px-3',
      confirmButton: 'btn btn-primary btn-sm mr-3',
      cancelButton: 'btn btn-secondary btn-sm',
    },
  });

export default ErrorModal;
