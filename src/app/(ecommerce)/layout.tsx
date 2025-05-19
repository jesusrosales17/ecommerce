import HeaderEcommerce from "@/components/template/HeaderEcommerce"

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <HeaderEcommerce />
      {children}
    </>
  )
}

export default layout