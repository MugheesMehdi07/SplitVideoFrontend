import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const useSweetAlert = () => {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (alert) {
      Swal.fire(alert).then((result) => {
        setAlert(null);
        if (alert.callback) {
          alert.callback(result);
        }
      });
    }
  }, [alert]);

  const defaultOptions = {
    position: "top-end",
    showConfirmButton: false,
    timer: 10000,
    toast: true,
  };

  const dynamicOptions = {
    success: { icon: 'success' },
    error: { icon: 'error' },
    warning: { icon: 'warning' },
  };

  const showAlert = (type, options) => {
    setAlert({ ...defaultOptions, ...dynamicOptions[type], ...options });
  };

  return showAlert;
};

export default useSweetAlert;
