import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table, Form, Col, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import API from "../lib/API";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";


const OrderDetailModal = ({ orderId, show, onClose }) => {
  const [order, setOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const columns = [
    {
      dataField: "id",
      text: "Order ID",
      type: "number",
      editable: false,
    },
    {
      dataField: "createdAt",
      text: "Date of Sale",
      type: "date",
      editable: false,
    },
    {
      dataField: "Product.name",
      text: "Product",
      type: "string",
      editable: false,
    },
    {
      dataField: "product_qty",
      text: "Quantity",
      type: "number",
      editable: true,
    },
  ];

  const getOrderDetails = async () => {
    const orderDetailsData = await API.OrderDetails.orderDetails(orderId);
    console.log(orderDetailsData.data)
    setOrder(orderDetailsData.data);
  };

  const handleCellEdit = async (oldValue, newValue, row, column) => {
    console.log(row)
    const updateBodyObj = {
      product_qty: row.product_qty
    };
    setErrorMsg(null);

    try {
      const myOrderData = await API.OrderDetails.updateOrderDetails(
        row.id,
        updateBodyObj
      );

      setErrorMsg("Order Updated");

      setTimeout(() => {
        setErrorMsg(null);
      }, 3000);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  useEffect(() => {
    if (orderId) getOrderDetails();
  }, [orderId]);

  return (
    <>
      <Modal size='lg' show={show} onHide={onClose}>
        <Modal.Header
          style={{ background: `linear-gradient(${"#007bff"}, ${"#002853"})` }}
        >
          <Modal.Title style={{ color: "white" }}>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className='text-center font-weight-bold'>Customer Info </div>
            <Form.Group as={Row} controlId='formPlaintextEmail'>
              {/* <Form.Label column sm='2'>
                Customer
              </Form.Label> */}
              <Col sm='3'>
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={
                    order &&
                    order.Customer.first_name + " " + order.Customer.last_name
                  }
                />
              </Col>
              {/* <Form.Label column sm='2'>
                Email
              </Form.Label> */}
              <Col sm='3'>
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={order && order.Customer.email}
                />
              </Col>
              <Col sm='3'>
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={order && order.Customer.phone_number}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId='formPlaintextPassword'>
              {/* <Form.Label column sm='2'>
                Password
              </Form.Label> */}
              <Col sm='5'>
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={
                    order &&
                    order.Customer.address_line1 +
                      " " +
                      order.Customer.address_line2
                  }
                />
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={
                    order &&
                    order.Customer.city +
                      ", " +
                      order.Customer.state +
                      " " +
                      order.Customer.zip_code
                  }
                />
              </Col>
              <Form.Label column sm='2'>
                Order Total
              </Form.Label>
              <Col sm='3'>
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={order && "$" + order.order_total}
                />
              </Col>
            </Form.Group>
          </Form>
          {order &&
            <BootstrapTable
              keyField='id'
              data={order.Order_Details}
              columns={columns}
              // expandRow={ expandRow }
              // rowEvents={rowEvents}
              // defaultSorted={defaultSorted}
              noDataIndication='No products defined'
              cellEdit={cellEditFactory({
                mode: "click",
                afterSaveCell: (oldValue, newValue, row, column) => {
                  handleCellEdit(oldValue, newValue, row, column);
                },
              })}
              // afterSaveCell={cellEdit.afterSaveCell()}
              // filter={filterFactory()}
              striped
              hover
              condensed
              bootstrap4
              blurToSave
            />
          }

          {/* <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Date of Sale</th>
                <th>Product</th>
                <th>Customer Paid</th>
                <th>Admin Paid</th>
              </tr>
            </thead>
            <tbody>
              {order &&
                order.Order_Details.map((orderDetail) => (
                  <tr>
                    <td>{orderDetail.OrderId}</td>
                    <td>
                      {new Date(orderDetail.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {orderDetail.Product.name +
                        " x " +
                        orderDetail.product_qty}
                    </td>
                   
                    <td>{order.customer_remit}</td>
                    <td>{order.seller_remit}</td>
                  </tr>
                ))}
            </tbody>
          </Table> */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={onClose}>
            Close
          </Button>
          {/* <Button variant='primary' onClick={handleSubmit}>
            Save Changes
          </Button> */}
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default OrderDetailModal;
