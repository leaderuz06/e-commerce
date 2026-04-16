'use client'

import CustomImage from '@/components/image'
import { ProductType } from '@/interfaces'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ReactStars from 'react-stars'

const ShoppingCart = () => {
  const [total, setTotal] = useState<number>(0)
  const [products, setProducts] = useState<ProductType[]>([])

  // ✅ localStorage faqat clientda
  useEffect(() => {
    try {
      const data = localStorage.getItem('cart')
      setProducts(data ? JSON.parse(data) : [])
    } catch (error) {
      console.error('localStorage error', error)
      setProducts([])
    }
  }, [])

  const syncStorage = (updatedCart: ProductType[]) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    setProducts(updatedCart)
  }

  const removeProduct = (id: number) => {
    const updatedCart = products.filter(product => product.id !== id)
    syncStorage(updatedCart)
  }

  const handleIncrement = (id: number) => {
    const updatedCart = products.map(product =>
      product.id === id
        ? { ...product, quantity: product.quantity + 1 }
        : product
    )

    syncStorage(updatedCart)
  }

  const handleDecrement = (id: number) => {
    const existProduct = products.find(p => p.id === id)

    if (existProduct?.quantity === 1) {
      removeProduct(id)
    } else {
      const updatedCart = products.map(product =>
        product.id === id
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )

      syncStorage(updatedCart)
    }
  }

  // ✅ total hisoblash
  useEffect(() => {
    const total = products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    )

    setTotal(total)
  }, [products])

  return (
    <>
      {products.length ? (
        <div className='h-screen bg-gray-100 pt-20'>
          <h1 className='mb-10 text-center text-2xl font-bold'>
            Cart Items
          </h1>

          <div className='mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0'>
            <div className='rounded-lg md:w-2/3'>
              {products.map(product => (
                <div
                  key={product.id}
                  className='mb-6 rounded-lg bg-white p-6 shadow-md sm:flex'
                >
                  <div className='relative w-52'>
                    <CustomImage product={product} fill />
                  </div>

                  <div className='sm:ml-4 sm:flex sm:w-full gap-x-4 sm:justify-between'>
                    <div className='mt-5 sm:mt-0'>
                      <h2 className='text-lg font-bold line-clamp-1'>
                        {product.title}
                      </h2>

                      <p className='mt-1 text-xs line-clamp-2'>
                        {product.description}
                      </p>

                      <div className='flex items-center text-sm my-4'>
                        <p>{product?.rating.rate}</p>

                        <div className='ml-2 mr-6'>
                          <ReactStars
                            count={5}
                            value={product?.rating.rate}
                            edit={false}
                          />
                        </div>

                        <p className='text-blue-600 text-xs'>
                          {product?.rating.count} reviews
                        </p>
                      </div>
                    </div>

                    <div className='mt-4 sm:block'>
                      <div className='flex items-center'>
                        <span
                          className='cursor-pointer px-3'
                          onClick={() => handleDecrement(product.id)}
                        >
                          -
                        </span>

                        <input
                          className='w-8 text-center'
                          type='number'
                          value={product.quantity}
                          readOnly
                        />

                        <span
                          className='cursor-pointer px-3'
                          onClick={() => handleIncrement(product.id)}
                        >
                          +
                        </span>
                      </div>

                      <div className='flex items-center space-x-4 mt-4'>
                        <p>
                          {(product.price * product.quantity).toLocaleString(
                            'en-US',
                            { style: 'currency', currency: 'usd' }
                          )}
                        </p>

                        <button
                          onClick={() => removeProduct(product.id)}
                          className='text-red-500'
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className='mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:w-1/3'>
              <div className='flex justify-between'>
                <p>Subtotal</p>
                <p>
                  {total.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'usd',
                  })}
                </p>
              </div>

              <div className='flex justify-between mt-2'>
                <p>Shipping</p>
                <p>$10.00</p>
              </div>

              <hr className='my-4' />

              <div className='flex justify-between font-bold'>
                <p>Total</p>
                <p>
                  {(total + 10).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'usd',
                  })}
                </p>
              </div>

              <button className='mt-6 w-full bg-blue-500 py-3 text-white rounded'>
                Check out
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex h-screen items-center justify-center'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold'>
              Shopping cart is empty
            </h1>

            <Link href='/products'>
              <button className='mt-4 bg-blue-600 text-white px-4 py-2 rounded'>
                Products
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export default ShoppingCart