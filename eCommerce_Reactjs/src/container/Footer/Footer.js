import React from 'react';

function Footer(props) {
  const handlePreventNavigation = (event) => {
    event.preventDefault();
  };
  return (
    <div>
      <footer className="footer-area section_gap">
        <div className="container">
          <div className="row">
            <div className="col-lg-2 col-md-6 single-footer-widget">
              <h4>Top Products</h4>
              <ul>
                <li><a href="/" onClick={handlePreventNavigation}>Managed Website</a></li>
                <li><a href="/" onClick={handlePreventNavigation}>Manage Reputation</a></li>
                <li><a href="/" onClick={handlePreventNavigation}>Power Tools</a></li>
                <li><a href="/" onClick={handlePreventNavigation}>Marketing Service</a></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6 single-footer-widget">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="/" onClick={handlePreventNavigation}>Jobs</a></li>
                <li><a href="/" onClick={handlePreventNavigation}>Brand Assets</a></li>
                <li><a href="/" onClick={handlePreventNavigation}>Investor Relations</a></li>
                <li><a href="/" onClick={handlePreventNavigation}>Terms of Service</a></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6 single-footer-widget">
              <h4>Features</h4>
              <ul>
                <li><a href="/" onClick={handlePreventNavigation}>Jobs</a></li>
                <li><a href="/" onClick={handlePreventNavigation}>Brand Assets</a></li>
                <li><a href="/" onClick={handlePreventNavigation}>Investor Relations</a></li>
                <li><a href="/" onClick={handlePreventNavigation}>Terms of Service</a></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6 single-footer-widget">
              <h4>Resources</h4>
              <ul>
                <li><a href="/" onClick={handlePreventNavigation}>Guides</a></li>
                <li><a href="/" onClick={handlePreventNavigation}>Research</a></li>
                <li><a href="/" onClick={handlePreventNavigation}>Experts</a></li>
                <li><a href="/" onClick={handlePreventNavigation}>Agencies</a></li>
              </ul>
            </div>

          </div>
          <div className="footer-bottom row align-items-center">
            <p className="footer-text m-0 col-lg-8 col-md-12">{/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
              Bản quyền ©2022 Đồ án tốt nghiệp của Đỗ Tấn Thành <i className="fa fa-heart-o" aria-hidden="true" />  <a href="https://colorlib.com" target="_blank" rel="noreferrer" aria-label="Colorlib"></a>
              {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}</p>

          </div>
        </div>
      </footer>

    </div>
  );
}

export default Footer;