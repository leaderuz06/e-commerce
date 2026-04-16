
import CustomImage from "@/components/image"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{
    id: string
  }>
}

const ProductDetailPage = async ({ params }: Props) => {
  const { id } = await params

  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
      cache: "no-store", 
    })

    if (!res.ok) return notFound()

    const product = await res.json()

    return (
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 px-4 mt-48 pb-10 " >
        <CustomImage product={product} width={400} height={100} />
        
        <div className="divide-y">
          <div className="space-y-2 pb-8">
            <h1 className="text-2xl md:text-4xl font-bold">
              {product?.title}
            </h1>
            <h2 className="text-gray-500 font-bold text-xl md:text-3xl">
              ${product?.price}
            </h2>
          </div>

          <div className="pt-4">
            <p className="text-xs md:text-sm">
              {product?.description}
            </p>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    return notFound()
  }
}

export default ProductDetailPage