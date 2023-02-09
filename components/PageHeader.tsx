const PageHeader = ({ children, className = "" }) => {
  return (
    <h1 className={`text-4xl font-semibold leading-normal ${className}`}>{children}</h1>
  );
};
export default PageHeader;
