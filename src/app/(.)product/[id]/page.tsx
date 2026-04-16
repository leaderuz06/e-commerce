'use client'

import CustomImage from "@/components/image"
import { ProductType } from "@/interfaces"
import { Dialog } from "@headlessui/react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ReactStars from "react-stars"
import { toast } from "react-toastify"


const ProductDetailedPage = () => {

  const {id} = useParams()
  // console.log(id)
  const [isLoading, setIsLoading] = useState(false)
  const [product, setProduct] = useState<ProductType>()
  const [isOpen, setIsOpen] = useState(true)
  const router = useRouter()
  const [isAdded, setIsAdded] = useState(false)

  const handleClick = () => {
    const products: ProductType[] = JSON.parse(localStorage.getItem('cart') || '[]')
    // console.log(products)
    const isExist = products.find((c) => c.id === product?.id)
    if(isExist){
      const updatedData = products.map((c) => {
        if(c.id === product?.id){
          return {...c, quantity: c.quantity + 1}
        }
        return c
      })
      localStorage.setItem('cart', JSON.stringify(updatedData))
    }else{
      const data = [...products, {...product, quantity: 1} as ProductType]
      localStorage.setItem('cart', JSON.stringify(data))
    }
    toast.success('Product added to cart')
    setIsAdded(true)
  
  }

  useEffect(() => {
    async function getData(){
      setIsLoading(true)
      const res = await fetch(`https://fakestoreapi.com/products/${id}`)
      const product = await res.json()
      setProduct(product)
      setIsLoading(false)
    }

    getData()
  }, [id])
  return (
    <Dialog open={isOpen} onClose={() => {setIsOpen(false), router.back()}} className='raletive z-50'>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true"/>
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className={'mx-auto max-w-3xl rounded bg-white p-10'}>
            {isLoading ? (
              <div className="h-8 w-8 rounded-full border-2 border-dotted border-blue-600 animate-spin" />
            ):(
              <div className="flex gap-x-8 h-96">
                {product?.image && (
                  <div className="relative w-72 h-full hidden md:inline">
                    <CustomImage product={product} fill />
                  </div>
                )}
                <div className="flex-1 flex flex-col">
                  <div className="flex-1">
                    <h4 className="font-semibold">{product?.title}</h4>
                    <p className="font-medium text-sm">${product?.price}</p>
                    <div className="flex items-center text-sm my-4"><p>{product?.rating?.rate}</p>
                    {product?.rating?.rate && (
                      <div className="flex items-center ml-5 mr-6">
                        <ReactStars value={product?.rating?.rate} edit={false} size={20} color2={'#ffd700'}/>
                      </div>
                    )}
                      <p className="text-blue-600 hover:underline cursor-pointer text-xs"> See all {product?.rating?.count} reviews</p>
                    </div>
                    <p className="line-clamp-6 text-sm">{product?.description}</p>
                  </div>
                  <div className="space-y-3 text-sm">
                    <button className="button w-full bg-blue-600 text-white border-transparent hover:border-blue-600 hover:bg-transparent hover:text-black" onClick={handleClick}>Add to bag</button>
                    <button onClick={() => window.location.reload()} className="button w-full bg-blue-600 text-white border-transparent hover:border-blue-600 hover:bg-transparent hover:text-black">View full details</button>
                  </div>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog> 
  )
}

export default ProductDetailedPage