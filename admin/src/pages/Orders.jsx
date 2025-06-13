import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { useContext } from 'react'
import { ProductContext } from '../context/ProductContext.jsx';

const Orders = () => {

  const { backendUrl, token } = useContext(ProductContext)
  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {

    if (!token) {
      return null;
    }

    try {
      
      const response = await axios.post(backendUrl + '/api/order/list', {}, {headers:{token}})
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }

  const statusHandler = async ( event, orderId ) => {
    try {
      const status = event.target.value
      const response = await axios.post(backendUrl + '/api/order/status', {orderId, status}, {headers:{token}})
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
      toast.error(response.data.message)
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])

  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {
          orders.map((order, index) => (
            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1.1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
              <img className='w-12' src={assets.parcel_icon} alt="" />
              <div>   
                <div>
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.sizeAvailable ? `(${item.size})` : item.size} </span></p>
                    } else {
                      return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.sizeAvailable ? `(${item.size})` : item.size} </span> ,</p>
                    }
                  })}
                </div>
                <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
                <div className='mb-2'>
                  {order.paymentMethod === 'delivery' && <p>{order.address.address} {order.address.zipcode}</p>}
                  {order.paymentMethod === 'staff' && <p>The Coming of Stages Studio</p>}
                </div>
                <p>{order.address.phone}</p>
              </div>
              <div>
                <p className='text-sm sm:text-[15px]'>Items : {order.items.length}</p>
                <p className='mt-3'>OrderID : {order.orderId}</p>
                <p>Method : {order.paymentMethod}</p>
                <p>Date : {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className='text-sm sm:text-[15px]'>฿{order.amount}</p>
              <div className='flex items-center justify-between'>
                <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className='p-2 font-semibold border rounded border-gray-300'>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <p
                  className={`min-w-3 h-3 rounded-full ${
                    order.status !== "Delivered" ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders
