'use client'
import Loading from '@/components/Application/Loading'
import UserPanelLayout from '@/components/Application/Website/UserPanelLayout'
import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'
import useFetch from '@/hooks/useFetch'
import { WEBSITE_ORDER_DETAILS } from '@/routes/WebsiteRoute'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'

const breadCrumbData = {
    title: 'Orders',
    links: [{ label: 'Orders' }]
}
const Orders = () => {
    const { data: orderData, loading } = useFetch("/api/user-order")

    return (
        <div>
            <WebsiteBreadcrumb props={breadCrumbData} />
            <UserPanelLayout>

                <div className='shadow rounded'>
                    <div className='p-5 text-xl font-semibold border-b'>
                        Orders
                    </div>
                    <div className='p-5'>
                        {loading ?
                            <div className='text-center py-5'>Loading...</div>
                            :
                            <div className='grid gap-4'>
                                {orderData && orderData?.data?.map((order, i) => (
                                    <Link key={order._id} href={WEBSITE_ORDER_DETAILS(order.order_id)} className='block'>
                                        <div className='border rounded p-4 hover:bg-gray-50 hover:shadow-sm transition-all cursor-pointer'>
                                            <div className='flex items-center justify-between mb-3'>
                                                <div className='flex items-center gap-2'>
                                                    <span className='text-xs font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded'>#{i + 1}</span>
                                                    <span className='text-xs text-gray-400 font-mono'>{order.order_id}</span>
                                                </div>
                                                <span className='text-sm font-semibold'>
                                                    {order.totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                                </span>
                                            </div>
                                            <div className='flex items-center gap-3 overflow-x-auto'>
                                                {order.products.map((product, idx) => (
                                                    <div key={idx} className='flex items-center gap-2 flex-shrink-0'>
                                                        <Image
                                                            src={product.variantId?.media?.[0]?.secure_url || imgPlaceholder.src}
                                                            width={40}
                                                            height={40}
                                                            alt={product.name}
                                                            className='rounded object-cover w-[40px] h-[40px] border'
                                                        />
                                                        <div className='min-w-0'>
                                                            <p className='text-sm font-medium line-clamp-1'>{product.name}</p>
                                                            <p className='text-xs text-gray-500'>Qty: {product.qty}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </Link>
                                ))}

                                {orderData && orderData?.data?.length === 0 && (
                                    <div className='text-center py-10 text-gray-400'>
                                        <p className='text-lg font-medium'>No orders yet</p>
                                        <p className='text-sm mt-1'>Your order history will appear here</p>
                                    </div>
                                )}
                            </div>
                        }

                    </div>
                </div>
            </UserPanelLayout>
        </div>
    )
}

export default Orders