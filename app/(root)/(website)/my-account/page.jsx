'use client'
import UserPanelLayout from '@/components/Application/Website/UserPanelLayout'
import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'
import useFetch from '@/hooks/useFetch';
import { WEBSITE_CART, WEBSITE_ORDER_DETAILS, WEBSITE_PRODUCT_DETAILS } from '@/routes/WebsiteRoute';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { IoCartOutline } from "react-icons/io5";
import { useSelector } from 'react-redux';
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'

const breadCrumbData = {
    title: 'Dashboard',
    links: [{ label: 'Dashboard' }]
}
const MyAccount = () => {
    const { data: dashboardData } = useFetch('/api/dashboard/user')
    const cartStore = useSelector(store => store.cartStore)

    return (
        <div>
            <WebsiteBreadcrumb props={breadCrumbData} />
            <UserPanelLayout>
                <div className='shadow rounded'>
                    <div className='p-5 text-xl font-semibold border'>
                        Dashboard
                    </div>
                    <div className='p-5'>
                        <div className='grid lg:grid-cols-2 grid-cols-1 gap-10'>
                            <div className='flex items-center justify-between gap-5 border rounded p-3'>
                                <div>
                                    <h4 className='font-semibold text-lg mb-1'>Total Orders</h4>
                                    <span className='font-semibold text-gray-500'>{dashboardData?.data?.totalOrder || 0}</span>
                                </div>
                                <div className='w-16 h-16 bg-primary rounded-full flex justify-center items-center'>
                                    <HiOutlineShoppingBag className='text-white' size={25} />
                                </div>
                            </div>
                            <div className='flex items-center justify-between gap-5 border rounded p-3'>
                                <div>
                                    <h4 className='font-semibold text-lg mb-1'>Items In Cart</h4>
                                    <span className='font-semibold text-gray-500'>{cartStore?.count}</span>
                                </div>
                                <div className='w-16 h-16 bg-primary rounded-full flex justify-center items-center'>
                                    <IoCartOutline className='text-white' size={25} />
                                </div>
                            </div>
                        </div>

                        {/* Cart Items Section */}
                        {cartStore?.count > 0 && (
                            <div className='mt-5'>
                                <div className='flex items-center justify-between mb-3'>
                                    <h4 className='text-lg font-semibold'>Your Cart Items</h4>
                                    <Link href={WEBSITE_CART} className='text-sm text-primary hover:underline underline-offset-2'>View Cart →</Link>
                                </div>
                                <div className='grid gap-3'>
                                    {cartStore.products.map(product => (
                                        <div key={product.variantId} className='flex items-center gap-4 border rounded p-3 hover:bg-gray-50 transition-colors'>
                                            <Image
                                                src={product.media || imgPlaceholder.src}
                                                width={50}
                                                height={50}
                                                alt={product.name}
                                                className='rounded object-cover w-[50px] h-[50px]'
                                            />
                                            <div className='flex-1 min-w-0'>
                                                <h5 className='font-medium text-sm line-clamp-1'>
                                                    <Link href={WEBSITE_PRODUCT_DETAILS(product.url)} className='hover:text-primary'>
                                                        {product.name}
                                                    </Link>
                                                </h5>
                                                <p className='text-xs text-gray-500'>
                                                    {product.color} · {product.size} · Qty: {product.qty}
                                                </p>
                                            </div>
                                            <div className='text-sm font-semibold text-nowrap'>
                                                {(product.sellingPrice * product.qty).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Orders Section */}
                        <div className='mt-5'>
                            <h4 className='text-lg font-semibold mb-3'>Recent Orders</h4>
                            <div className='grid gap-4'>
                                {dashboardData && dashboardData?.data?.recentOrders?.map((order) => (
                                    <Link key={order._id} href={WEBSITE_ORDER_DETAILS(order.order_id)} className='block'>
                                        <div className='border rounded p-4 hover:bg-gray-50 hover:shadow-sm transition-all cursor-pointer'>
                                            <div className='flex items-center justify-between mb-3'>
                                                <span className='text-xs text-gray-400 font-mono'>{order.order_id}</span>
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
                            </div>
                        </div>

                    </div>
                </div>
            </UserPanelLayout>
        </div>
    )
}

export default MyAccount