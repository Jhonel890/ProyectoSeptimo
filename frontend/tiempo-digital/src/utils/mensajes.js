import Swal from 'sweetalert2';

export const Alerta = ({ title, text, icon="success", confirmButtonText="aceptar", onConfirm }) => {
  const showAlert = () => {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText,
    }).then((result) => {
      if (result.isConfirmed && onConfirm) {
        onConfirm();
      }
    });
  };

    return showAlert(); 
};