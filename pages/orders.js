import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { set } from "mongoose";
import { useEffect, useState } from "react";

export default function OrdersPage()
{
    const [orders,setOrders]= useState([])
    const [isLoading,setIsLoading]= useState(false)

    useEffect(()=>{
        setIsLoading(true)
            axios.get('/api/orders').then(response=>{
                    setOrders(response.data)
                    setIsLoading(false)
            })
    },[])
    return(
        <Layout>
            <h1>Commandes</h1>
          

        
            <table className="basic">
                <thead>
                    <th>Date</th>
                    <th>Client</th>
                    <th>Produits</th>
                    <th>Payement</th>
                </thead>
                <tbody>
                {isLoading && (
          <tr>
            <td colSpan={4}>
              <div className="py-4">
                <Spinner fullWidth={true} />
              </div>
            </td>
          </tr>
        )}
                    {orders.length > 0 && orders.map(order =>(
                        <tr key={order._id}>
                            <td>
                                {new Date(order.createdAt).toLocaleString()}
                            </td>
                            <td>
                                {order.name} {order.email} <br />
                                {order.city} {order.postalCode} {order.country} <br />
                                {order.streetAddress} <br />
                                {order.phone}
                            </td>
                            <td>
                                {order.line_items.map(l =>(
                                    <>
                                    {l.price_data?.product_data.name} x {l.quantity} <br/>
                                      
                                    </>
                                ))}
                            </td>
                            <td className={order.paid?'text-green-600': 'text-red-600'}>
                                {order.paid? 'OUI': 'NON'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}