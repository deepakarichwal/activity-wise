import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import styles from "./PageNav.module.css";

export default function PageNav() {
  return (
    <nav className={styles.nav}>
      <Logo />
      <ul className={styles.links}>
        <li className={styles.link}>
          <NavLink to="/product">Product</NavLink>
        </li>
        <li className={styles.link}>
          <NavLink to="/pricing">Pricing</NavLink>
        </li>
        <li className={styles.link}>
          <NavLink className={styles.ctaLink} to="/login">
            Login
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
