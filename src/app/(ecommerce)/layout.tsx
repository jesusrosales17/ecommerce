import HeaderEcommerce from "@/components/template/HeaderEcommerce"

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-gray-100">
      <HeaderEcommerce />
      {children}
    </div>
  )
}

export default layout