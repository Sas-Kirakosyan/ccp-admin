import Swal from 'sweetalert2/dist/sweetalert2.js';

const html = (result) =>
  `
  <div class="swal-text-html">
    ${
      result === 'success'
        ? '<i class="far fa-check-circle mr-2 text-success"></i>'
        : '<i class="fas fa-exclamation-circle text-danger mr-2"></i>'
    }
    <span class="swal-text">${
      result === 'success'
        ? 'Invite successfully sent.'
        : 'Failed to send an invite.'
    }</span>
  </div>
  `;

const InviteResultModal = ({ result }) =>
  Swal.fire({
    title: '',
    width: '310px',
    html: html(result),
    showCancelButton: false,
    confirmButtonText: 'Ok',
    animation: false,
    buttonsStyling: false,
    customClass: {
      container: 'rounded-0',
      popup: 'rounded-0',
      confirmButton: 'btn btn-primary btn-sm',
    },
  });

export default InviteResultModal;
