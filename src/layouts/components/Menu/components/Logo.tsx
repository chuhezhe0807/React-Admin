import logo from "@/assets/images/logo.png"
import type {RootState} from "@/redux/index";

import { useSelector } from "react-redux"

const Logo = () => {
  const { isCollapse } = useSelector((state: RootState) => state.menu);

  return (
    <div className="logo-box">
      <img src={logo} alt="logo" className="logo-img" />
      {!isCollapse ? <h2 className="logo-text">React-Admin</h2> : null}
    </div>
  )
}

export default Logo;
