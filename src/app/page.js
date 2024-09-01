"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported

const HomePage = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [ledStatus, setLedStatus] = useState(null); // State for LED status

  const fetchData = async () => {
    try {
      const response = await fetch("/api/get");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(error);
    }
  };

  const fetchLedStatus = async () => {
    try {
      const response = await fetch("/api/iot", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          // อื่นๆ หากจำเป็น
        },
        // credentials: 'include' // ใช้ถ้าคุณต้องการส่งคุกกี้หรือข้อมูลการยืนยันตัวตน
      });
      if (!response.ok) {
        throw new Error("Failed to fetch LED status");
      }
      const ledData = await response.json();
      setLedStatus(ledData.led_status);
    } catch (error) {
      console.error("Error fetching LED status:", error);
      setError(error);
    }
  };

  useEffect(() => {
    

    fetchData();
    fetchLedStatus();

    const intervalId = setInterval(() => {
      fetchData();
      fetchLedStatus();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleUpdate = async (id, value) => {
    try {
      const response = await fetch("/api/iot", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ led_status: value }),
      });

      if (!response.ok) {
        throw new Error("Failed to update data");
      }

      setLedStatus(value);
    } catch (error) {
      console.error("Error updating data:", error);
      setError(error);
    }
  };

  if (error) {
    return <div className="alert alert-danger">Error: {error.message}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Sensor Dashboard</h1>
      <div className="row">
        <div className="col-md-4 mb-4 d-flex">
          {/* Card for Ultrasonic & LED Ultrasonic */}
          <div className="card flex-fill" style={{ backgroundColor: '#100258', color: '#000' }}>
            <div className="card-body d-flex flex-column">
              <h5 className="card-title border border-dark p-2 rounded">volum & rgb_volum</h5>
              <p className="card-text">
                <strong>volum:</strong> {data[0]?.volum || 'Loading...'} Ohm
              </p>
              <p className="card-text">
                <strong>rgb_volum:</strong> {data[0]?.rgb_volum || 'Loading...'}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4 d-flex">
          {/* Card for LDR & LED LDR Pin */}
          <div className="card flex-fill" style={{ backgroundColor: '#100258', color: '#000' }}>
            <div className="card-body d-flex flex-column">
              <h5 className="card-title border border-dark p-2 rounded">LDR & LED LDR Pin</h5>
              <p className="card-text">
                <strong>LDR:</strong> {data[0]?.ldr || 'Loading...'} Lux
              </p>
              <p className="card-text">
                <strong>LED LDR Pin Green:</strong> {data[0]?.led_ldr_pin || 'Loading...'}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4 d-flex">
          {/* Card for LED Status & Controls */}
          <div className="card flex-fill" style={{ backgroundColor: '#100258', color: '#000' }}>
            <div className="card-body d-flex flex-column">
              <h5 className="card-title border border-dark p-2 rounded">LED Status & Controls</h5>
              <p className="card-text">
                <strong>LED Status Green:</strong>{" "}
                {ledStatus !== null ? ledStatus : "Loading..."}
              </p>
              <div className="d-flex gap-3 mt-auto">
                <button
                  className="btn btn-primary"
                  onClick={() => handleUpdate(data[0]?.id, 0)}
                >
                  Set LED Status to Off
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => handleUpdate(data[0]?.id, 1)}
                >
                  Set LED Status to On
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
