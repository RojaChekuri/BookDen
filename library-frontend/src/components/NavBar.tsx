import {
  VisaCloseTiny,
  VisaMenuLow,
  VisaGlossaryHigh,
} from "@visa/nova-icons-react";
import {
  Button,
  Nav,
  NavAppName,
  Tab,
  Tabs,
  Typography,
  UtilityFragment,
} from "@visa/nova-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const id = "alternate-active-element-horizontal-nav";

export const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Determine selected menu item
  const selectedMenu = (() => {
    if (location.pathname === "/" || location.pathname === "") return "home";
    if (location.pathname.startsWith("/favorites")) return "favorites";
    if (location.pathname.startsWith("/add-book")) return "add-book";
    return ""; // fallback
  })();

  const isHome = selectedMenu === "home";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial check on load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onToggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getMenuLinkClass = (key: string) => {
    const isActive = selectedMenu === key;

    if (isActive) {
      if (isHome && !isScrolled) {
        return "menu-link active home-transparent";
      } else {
        return "menu-link active scrolled";
      }
    }
    return "menu-link";
  };

  const navClassName = isHome && !isScrolled ? "navbar transparent" : "navbar";

  return (
    <div>
      <UtilityFragment vJustifyContent="between">
        <Nav
          id={id}
          alternate
          orientation="horizontal"
          tag="header"
          className={navClassName}
        >
          <>
            {/* Mobile Hamburger */}
            <UtilityFragment vContainerHide="desktop">
              <Button
                aria-controls={`${id}-mobile-menu`}
                aria-expanded={mobileMenuOpen ? "true" : "false"}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                buttonSize="large"
                colorScheme="tertiary"
                iconButton
                id={`${id}-mobile-menu-button`}
                onClick={onToggleMobileMenu}
                className="button-icon-white"
              >
                {mobileMenuOpen ? <VisaCloseTiny /> : <VisaMenuLow />}
              </Button>
            </UtilityFragment>

            {/* Logo + App Name */}
            <UtilityFragment vFlex vGap={16}>
              <Link
                aria-label="The Book Den Home"
                to="/"
                id={`${id}-home-link`}
                className="logo-link"
              >
                <VisaGlossaryHigh className="button-icon-white" />
                <NavAppName>
                  <UtilityFragment vContainerHide="xs">
                    <Typography variant="headline-3" className="logo-text">
                      The Book Den
                    </Typography>
                  </UtilityFragment>
                </NavAppName>
              </Link>
            </UtilityFragment>

            {/* Desktop Menu Tabs */}
            <UtilityFragment
              vFlex
              vJustifyContent="end"
              vFlexGrow
              vMarginLeft="auto"
              vContainerHide="mobile"
            >
              <nav aria-label="Primary navigation">
                <UtilityFragment vGap={4}>
                  <Tabs>
                    <Tab>
                      <Button
                        aria-current={selectedMenu === "home" ? "page" : undefined}
                        buttonSize="large"
                        colorScheme="tertiary"
                        element={
                          <Link to="/" className={getMenuLinkClass("home")}>
                            Home
                          </Link>
                        }
                      />
                    </Tab>
                    <Tab>
                      <Button
                        buttonSize="large"
                        colorScheme="tertiary"
                        element={
                          <Link to="/favorites" className={getMenuLinkClass("favorites")}>
                            Favorites
                          </Link>
                        }
                      />
                    </Tab>
                    <Tab>
                      <Button
                        buttonSize="large"
                        colorScheme="tertiary"
                        element={
                          <Link to="/add-book" className={getMenuLinkClass("add-book")}>
                            Add Book
                          </Link>
                        }
                      />
                    </Tab>
                  </Tabs>
                </UtilityFragment>
              </nav>
            </UtilityFragment>
          </>
        </Nav>
      </UtilityFragment>

      {/* Mobile menu */}
      <UtilityFragment vContainerHide="desktop" vHide={!mobileMenuOpen}>
        <Nav
          alternate
          aria-label="Mobile menu"
          aria-hidden={!mobileMenuOpen}
          id={`${id}-mobile-menu`}
          orientation="vertical"
          className="mobile-menu"
        >
          <Tabs orientation="vertical">
            <Tab>
              <Button
                buttonSize="large"
                colorScheme="tertiary"
                element={
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={getMenuLinkClass("home")}
                  >
                    Home
                  </Link>
                }
              />
            </Tab>
            <Tab>
              <Button
                buttonSize="large"
                colorScheme="tertiary"
                element={
                  <Link
                    to="/favorites"
                    onClick={() => setMobileMenuOpen(false)}
                    className={getMenuLinkClass("favorites")}
                  >
                    Favorites
                  </Link>
                }
              />
            </Tab>
            <Tab>
              <Button
                buttonSize="large"
                colorScheme="tertiary"
                element={
                  <Link
                    to="/add-book"
                    onClick={() => setMobileMenuOpen(false)}
                    className={getMenuLinkClass("add-book")}
                  >
                    Add Book
                  </Link>
                }
              />
            </Tab>
          </Tabs>
        </Nav>
      </UtilityFragment>
    </div>
  );
};