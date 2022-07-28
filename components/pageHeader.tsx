const Header = ({ children, className = "" }) => {
  return (
    <h1 className={`text-4xl font-semibold mb-5 ${className}`}>{children}</h1>
  );
};
export default Header;
