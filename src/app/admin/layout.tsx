interface Props {
  children: React.ReactNode;
}
const layout = ({ children }: Props) => {
  return (
    <div>
      layout admin
      {children}
      
    </div>
  );
};

export default layout;
