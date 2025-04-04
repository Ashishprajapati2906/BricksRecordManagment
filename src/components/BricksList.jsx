import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Button, Modal, Form } from "react-bootstrap";
import * as XLSX from 'xlsx';
import Navbar from "../Navbar/Navbar";


const ViewOrders = () => {
	const [orders, setOrders] = useState([]);
	const [viewType, setViewType] = useState("table");
	const [showModal, setShowModal] = useState(false);
	const [currentOrder, setCurrentOrder] = useState(null);

	const [paymentFilter, setPaymentFilter] = useState("All");


	useEffect(() => {
		const unsubscribe = onSnapshot(collection(db, "bricksOrders"), (snapshot) => {
			const ordersData = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setOrders(ordersData);
		});
		return () => unsubscribe();
	}, []);

	const handleFilterChange = (e) => {
		setPaymentFilter(e.target.value);
	};

	const filteredOrders = paymentFilter === "All" ? orders : orders.filter((order) => order.paymentStatus === paymentFilter);


	const handleEdit = (order) => {
		setCurrentOrder(order);
		setShowModal(true);
	};

	const handleDelete = async (order) => {
		const confirm = window.confirm("Are you sure you want to delete this order?");
		if (!confirm) return;
	  
		try {
		  await deleteDoc(doc(db, "bricksOrders", order.id));
		  alert("Order deleted successfully!");
		} catch (error) {
		  console.error("Delete failed:", error);
		  alert("Failed to delete the order.");
		}
	  };
	  

	const handleUpdate = async () => {
		if (currentOrder) {
			const orderRef = doc(db, "bricksOrders", currentOrder.id);
			await updateDoc(orderRef, currentOrder);
			setShowModal(false);
		}
	};

	// **Handle Bricks Quantity Change**
	const handleQuantityChange = (e) => {
		const newQuantity = Number(e.target.value);
		const pricePer1000 = Number(currentOrder.bricksPricePer1000) || 0;
		const newTotal = (newQuantity / 1000) * pricePer1000;
		const newRemaining = newTotal - (Number(currentOrder.advanceAmount) || 0);

		setCurrentOrder({
			...currentOrder,
			bricksQuantity: newQuantity,
			totalAmount: newTotal.toFixed(2),
			remainingAmount: newRemaining.toFixed(2),
		});
	};

	const handleQuantityOrAdvanceChange = (field, value) => {
		const updatedOrder = { ...currentOrder, [field]: Number(value) };

		const newQuantity = Number(updatedOrder.bricksQuantity) || 0;
		const pricePer1000 = Number(updatedOrder.bricksPricePer1000) || 0;
		const newTotal = (newQuantity / 1000) * pricePer1000;
		const newAdvance = Number(updatedOrder.advanceAmount) || 0;
		const newRemaining = newTotal - newAdvance;

		const updatedPaymentStatus = newRemaining === 0 ? "Paid" : "Pending";

		setCurrentOrder({
			...updatedOrder,
			totalAmount: newTotal.toFixed(2),
			remainingAmount: newRemaining.toFixed(2),
			paymentStatus: updatedPaymentStatus,
		});
	};


	// Handle Excel download
	const handleDownloadExcel = () => {
		const data = filteredOrders.map((order) => ({
			"Gadi Number": order.gadiNumber,
			"Bricks Price": order.bricksPricePer1000,
			"Bricks Quantity": order.bricksQuantity,
			"City/Gaon": order.cityGaon,
			"Client Name": order.clientName,
			"Contact Number": order.contactNumber,
			"Total Amount": order.totalAmount,
			"Advance Amount": order.advanceAmount,
			"Remaining Amount": order.remainingAmount,
			"Payment Status": order.paymentStatus,
			"Date": order.date,
		}));

		// Create worksheet
		const ws = XLSX.utils.json_to_sheet(data);

		// Style for headers
		const headerStyle = {
			font: { bold: true, sz: 20 }, // Bold and font size 12 for headings
			alignment: { horizontal: "center" }, // Center alignment for headers
		};

		// Apply style to headers (first row)
		const range = XLSX.utils.decode_range(ws['!ref']); // Get sheet range
		for (let col = range.s.c; col <= range.e.c; col++) {
			const cellAddress = { r: range.s.r, c: col }; // First row (headers)
			const cellRef = XLSX.utils.encode_cell(cellAddress);
			if (!ws[cellRef]) continue;
			ws[cellRef].s = headerStyle; // Apply style
		}

		// Create a new workbook and append the sheet
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Orders");

		// Write file
		XLSX.writeFile(wb, "orders.xlsx");
	};



	return (

		<div className="container">
			<h2 className="text-center">Bricks Orders (Real-time)</h2>
			<div className="d-flex justify-content-center mb-3">
				<Button variant="primary" className="me-2" onClick={() => setViewType("table")}>
					Table View
				</Button>
				<Button variant="secondary" onClick={() => setViewType("list")}>
					List View
				</Button>
			</div>
			<div className="d-flex justify-content-center mb-3">
				<Button variant="success" onClick={handleDownloadExcel}>
					Download Excel
				</Button>
			</div>

			<div className="d-flex justify-content-center mb-3">
				<select className="form-select" onChange={handleFilterChange} value={paymentFilter}>
					<option value="All">All</option>
					<option value="Paid">Paid</option>
					<option value="Pending">Pending</option>
				</select>
			</div>

			{viewType === "table" ? (
			 <div className="wrapper">
			 {/* Responsive scrollable wrapper */}
			 <div style={{ overflowX: "auto", width: "100%" }}>
			   <table className="table table-bordered">
				 <thead className="sticky-top bg-white" style={{ top: 0, zIndex: 2 }}>
				   <tr>
					 <th>No</th>
					 <th>Gadi Number</th>
					 <th>Bricks Price</th>
					 <th>Bricks Quantity</th>
					 <th>City</th>
					 <th>Client Name</th>
					 <th>Contact Number</th>
					 <th>Total Amount</th>
					 <th>Advance</th>
					 <th>Remaining</th>
					 <th>Date</th>
					 <th>Payment Status</th>
					 <th>Actions</th>
				   </tr>
				 </thead>
				 <tbody>
				   {filteredOrders.map((order, index) => (
					 <tr key={order.id} className="premium-row">
					   <td>{index + 1}</td>
					   <td>{order.gadiNumber}</td>
					   <td>₹{order.bricksPricePer1000}</td>
					   <td>{order.bricksQuantity}</td>
					   <td>{order.cityGaon}</td>
					   <td>{order.clientName}</td>
					   <td>{order.contactNumber}</td>
					   <td><strong>₹{order.totalAmount}</strong></td>
					   <td><span className="text-primary">₹{order.advanceAmount}</span></td>
					   <td><span className="text-danger">₹{order.remainingAmount}</span></td>
					   <td>{order.date}</td>
					   <td>
						 <span className={`badge ${order.paymentStatus === "Paid" ? "bg-success" : "bg-danger"}`}>
						   {order.paymentStatus}
						 </span>
					   </td>
					   <td>
						 <Button variant="warning" size="sm" onClick={() => handleEdit(order)} className="premium-btn">
						   ✏️ Edit
						 </Button>{" "}
						 <Button variant="danger" size="sm" onClick={() => handleDelete(order)}>
        Delete
      </Button>
					   </td>
					 </tr>
				   ))}
				 </tbody>
			   </table>
			 </div>
		   </div>







			) : (
				<div className="row">
					{filteredOrders.map((order) => (
						<div key={order.id} className="col-md-6 col-lg-4 mb-4">
							<div
								className="card border-0 shadow-lg rounded-4 overflow-hidden"
								style={{
									background: "#ffffff",
									transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
									boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.1)",
									borderRadius: "16px",
									border: "1px solid #ddd",
									overflow: "hidden",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = "scale(1.03)";
									e.currentTarget.style.boxShadow = "0px 10px 30px rgba(0, 0, 0, 0.15)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = "scale(1)";
									e.currentTarget.style.boxShadow = "0px 6px 15px rgba(0, 0, 0, 0.1)";
								}}
							>
								{/* 🔥 Header with Subtle Gradient */}
								<div className="card-header text-white text-center py-3 fw-bold"
									style={{
										background: "linear-gradient(135deg, #007bff, #0056b3)",
										fontSize: "1.3rem",
										textTransform: "uppercase"
									}}
								>
									🚛 {order.clientName} <span className="text-warning">({order.gadiNumber})</span>
								</div>

								{/* 🔥 Card Body */}
								<div className="card-body p-4 text-dark" style={{ fontSize: "1rem" }}>
									<p className="mb-2"><strong>📦 Bricks:</strong> {order.bricksQuantity} Units</p>
									<p className="mb-2"><strong>📍 City:</strong> {order.cityGaon}</p>
									<p className="mb-2"><strong>📞 Contact:</strong> {order.contactNumber}</p>
									<p className="mb-2"><strong>💰 Total:</strong> <span className="fw-bold text-success">₹{order.totalAmount}</span></p>
									<p className="mb-2"><strong>💵 Advance:</strong> <span className="fw-bold text-primary">₹{order.advanceAmount}</span></p>
									<p className="mb-2"><strong>🧾 Remaining:</strong> <span className="fw-bold text-danger">₹{order.remainingAmount}</span></p>

									{/* ✅ Payment Status Badge */}
									<p className="mb-2">
										<strong>📝 Payment Status:</strong>
										<span
											className={`badge ${order.paymentStatus === "Paid" ? "bg-success" : "bg-danger"} ms-2 px-3 py-2 rounded-pill`}
										>
											{order.paymentStatus}
										</span>
									</p>

									<p className="mb-0"><strong>📅 Date:</strong> {order.date}</p>
								</div>

								{/* 🔥 Footer with Modern Button */}
								<div className="card-footer bg-light text-center py-3">
									<Button
										variant="primary" size="sm" className="fw-bold px-4 py-2 rounded-3"
										style={{
											transition: "0.3s",
											fontSize: "1rem",
											backgroundColor: "#007bff",
											color: "#fff",
											border: "none",
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.backgroundColor = "#0056b3";
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.backgroundColor = "#007bff";
										}}
										onClick={() => handleEdit(order)}
									>
										✏️ Edit Order
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>


			)}

			{/* Edit Modal */}
			<Modal show={showModal} onHide={() => setShowModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Edit Order</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{currentOrder && (
						<Form>
							<Form.Group>
								<Form.Label>Gadi Number</Form.Label>
								<Form.Control type="text" value={currentOrder.gadiNumber}
									onChange={(e) => setCurrentOrder({ ...currentOrder, gadiNumber: e.target.value })} />
							</Form.Group>

							<Form.Group>
								<Form.Label>Bricks Price Per 1000</Form.Label>
								<Form.Control type="number" value={currentOrder.bricksPricePer1000}
									onChange={(e) => setCurrentOrder({ ...currentOrder, bricksPricePer1000: e.target.value })} />
							</Form.Group>

							<Form.Group>
								<Form.Label>Bricks Quantity</Form.Label>
								<Form.Control type="number" value={currentOrder.bricksQuantity}
									onChange={(e) => handleQuantityOrAdvanceChange("bricksQuantity", e.target.value)} />
							</Form.Group>

							<Form.Group>
								<Form.Label>City/Gaon</Form.Label>
								<Form.Control type="text" value={currentOrder.cityGaon}
									onChange={(e) => setCurrentOrder({ ...currentOrder, cityGaon: e.target.value })} />
							</Form.Group>

							<Form.Group>
								<Form.Label>Client Name</Form.Label>
								<Form.Control type="text" value={currentOrder.clientName}
									onChange={(e) => setCurrentOrder({ ...currentOrder, clientName: e.target.value })} />
							</Form.Group>

							<Form.Group>
								<Form.Label>Contact Number</Form.Label>
								<Form.Control type="text" value={currentOrder.contactNumber}
									onChange={(e) => setCurrentOrder({ ...currentOrder, contactNumber: e.target.value })} />
							</Form.Group>

							<Form.Group>
								<Form.Label>Total Amount</Form.Label>
								<Form.Control type="number" value={currentOrder.totalAmount} readOnly />
							</Form.Group>

							<Form.Group>
								<Form.Label>Advance Amount</Form.Label>
								<Form.Control type="number" value={currentOrder.advanceAmount}
									onChange={(e) => handleQuantityOrAdvanceChange("advanceAmount", e.target.value)} />
							</Form.Group>

							<Form.Group>
								<Form.Label>Remaining Amount</Form.Label>
								<Form.Control type="number" value={currentOrder.remainingAmount} readOnly />
							</Form.Group>

							<Form.Group>
								<Form.Label>Payment Status</Form.Label>
								<Form.Control type="text" value={currentOrder.paymentStatus} readOnly />
							</Form.Group>



							<Form.Group>
								<Form.Label>Date</Form.Label>
								<Form.Control type="date" value={currentOrder.date}
									onChange={(e) => setCurrentOrder({ ...currentOrder, date: e.target.value })} />
							</Form.Group>
						</Form>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
					<Button variant="success" onClick={handleUpdate}>Save Changes</Button>
				</Modal.Footer>
			</Modal>

		</div>

	);
};

export default ViewOrders;
