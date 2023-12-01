import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage()
{
    const [orders,setOrders]= useState([])

    useEffect(()=>{
            axios.get('/api/orders').then(response=>{
                    setOrders(response.data)
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