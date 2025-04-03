import React, { useState } from "react";
import { collection, addDoc, db } from "../firebase/firebaseConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaTruck, FaUser, FaMapMarkerAlt, FaPhone, FaMoneyBill, FaCalendar, FaStickyNote, FaBox } from "react-icons/fa";

const BrickForm = () => {
  const [formData, setFormData] = useState({
    gadiNumber: "",
    bricksPricePer1000: "",
    bricksQuantity: "",
    cityGaon: "",
    clientName: "",
    contactNumber: "",
    totalAmount: "",
    advanceAmount: "",
    remainingAmount: "",
    paymentStatus: "Pending",
    deliveryStatus: "Not Delivered",
    date: "",
    notes: "",
	isDelete:0,
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (["bricksPricePer1000", "bricksQuantity", "advanceAmount"].includes(name)) {
      value = value === "" ? "" : Number(value);
    }

    let updatedFormData = { ...formData, [name]: value };

    // Auto-calculate Total Amount & Remaining Amount
    if (updatedFormData.bricksPricePer1000 && updatedFormData.bricksQuantity) {
      updatedFormData.totalAmount = (updatedFormData.bricksPricePer1000 / 1000) * updatedFormData.bricksQuantity;
    }

    if (updatedFormData.totalAmount && updatedFormData.advanceAmount) {
      updatedFormData.remainingAmount = updatedFormData.totalAmount - updatedFormData.advanceAmount;
    }

    // Auto-update Payment Status
    updatedFormData.paymentStatus = updatedFormData.remainingAmount > 0 ? "Pending" : "Paid";

    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "bricksOrders"), formData);
      alert("Data successfully saved!");
      setFormData({
        gadiNumber: "",
        bricksPricePer1000: "",
        bricksQuantity: "",
        cityGaon: "",
        clientName: "",
        contactNumber: "",
        totalAmount: "",
        advanceAmount: "",
        remainingAmount: "",
        paymentStatus: "Pending",
        deliveryStatus: "Not Delivered",
        date: "",
        notes: "",
		isDelete:0,
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="text-center mb-4 text-primary">Bricks Order Form</h2>
        <form onSubmit={handleSubmit} className="row g-3">
          {/* Input Fields */}
          {[
            { name: "gadiNumber", label: "Gadi Number", icon: <FaTruck /> },
            { name: "bricksPricePer1000", label: "Bricks Price (Per 1000)", icon: <FaMoneyBill /> },
            { name: "bricksQuantity", label: "Bricks Quantity", icon: <FaBox /> },
            { name: "cityGaon", label: "City/Gaon", icon: <FaMapMarkerAlt /> },
            { name: "clientName", label: "Client Name", icon: <FaUser /> },
            { name: "contactNumber", label: "Contact Number", icon: <FaPhone /> },
            { name: "advanceAmount", label: "Advance Amount", icon: <FaMoneyBill /> },
          ].map(({ name, label, icon }, index) => (
            <div className="col-md-6" key={index}>
              <label className="form-label fw-bold">
                {icon} <span className="ms-2">{label}</span>
              </label>
              <input
                type="text"
                className="form-control border-primary shadow-sm"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          {/* Read-Only Fields */}
          {[
            { name: "totalAmount", label: "Total Amount", icon: <FaMoneyBill /> },
            { name: "remainingAmount", label: "Remaining Amount", icon: <FaMoneyBill /> },
          ].map(({ name, label, icon }, index) => (
            <div className="col-md-6" key={index}>
              <label className="form-label fw-bold">
                {icon} <span className="ms-2">{label}</span>
              </label>
              <input
                type="text"
                className="form-control border-primary shadow-sm"
                name={name}
                value={formData[name]}
                readOnly
              />
            </div>
          ))}

          {/* Dropdown Fields */}
          <div className="col-md-6">
            <label className="form-label fw-bold">Payment Status</label>
            <input
              type="text"
              className="form-control border-primary shadow-sm"
              name="paymentStatus"
              value={formData.paymentStatus}
              readOnly
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">
              <FaBox className="me-2" />
              Delivery Status
            </label>
            <select
              className="form-control border-primary shadow-sm"
              name="deliveryStatus"
              value={formData.deliveryStatus}
              onChange={handleChange}
            >
              <option value="Not Delivered">Not Delivered</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          

          {/* Date Field */}
          <div className="col-md-6">
            <label className="form-label fw-bold">
              <FaCalendar className="me-2" />
              Date
            </label>
            <input
              type="date"
              className="form-control border-primary shadow-sm"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

		  {/* Notes Field */}
          <div className="col-md-6">
            <label className="form-label fw-bold">
              <FaStickyNote className="me-2" />
              Notes
            </label>
            <textarea
              className="form-control border-primary shadow-sm"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <div className="col-12 text-center">
            <button type="submit" className="btn btn-primary btn-lg shadow-lg px-5 py-2">
              Submit Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrickForm;
