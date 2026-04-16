import Hero from '@/components/hero'
import Product from '@/components/product'
import { ProductType } from '@/interfaces'
import React from 'react'

const HomePage = async () => {
  const res = await fetch('http://fakestoreapi.com/products')
  const products: ProductType[] = await res.json()
  return (
    <main className='min-h-screen max-w-7xl mx-auto px-8 xl:px-0'>
      <section className='flex flex-col space-y-12'>
        <Hero />
        <h1 className='text-5xl font-semibold text-center text-black'>LEADER SHOP DEALS</h1>
      </section>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8 gap-y10'>{products.map((product) => (
        <Product key={product.id} product={product} />
      ))}</div>
    </main>
  )
}

export default HomePage