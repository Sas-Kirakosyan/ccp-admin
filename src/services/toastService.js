import { toast, Flip } from 'react-toastify';

const commonToastConfig = {
  transition: Flip,
  position: 'top-center',
  closeButton: true,
  autoClose: 3000,
  hideProgressBar: true,
};

export function showError(errorText) {
  toast.error(errorText, commonToastConfig);
}

export function showSuccess(successText) {
  toast.success(successText, commonToastConfig);
}
