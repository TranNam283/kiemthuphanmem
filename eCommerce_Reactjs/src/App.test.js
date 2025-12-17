import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('react-toastify', () => ({
  ToastContainer: () => null,
}));

jest.mock('./container/Header/Header', () => () => (
  <div data-testid="header">Header</div>
));

jest.mock('./container/Footer/Footer', () => () => (
  <div data-testid="footer">Footer</div>
));

jest.mock('./container/Home/HomePage', () => () => (
  <div data-testid="home-page">HomePage</div>
));

jest.mock('./container/Shop/ShopPage', () => () => <div>ShopPage</div>);
jest.mock('./container/DetailProduct/DetailProductPage', () => () => (
  <div>DetailProductPage</div>
));
jest.mock('./container/ShopCart/ShopCartPage', () => () => <div>ShopCartPage</div>);
jest.mock('./container/Blog/BlogPage', () => () => <div>BlogPage</div>);
jest.mock('./container/Blog/DetailBlog', () => () => <div>DetailBlog</div>);
jest.mock('./container/System/HomePageAdmin', () => () => <div>HomePageAdmin</div>);
jest.mock('./container/System/Email/VerifyEmail', () => () => <div>VerifyEmail</div>);
jest.mock('./container/Login/LoginWebPage', () => () => <div>LoginWebPage</div>);
jest.mock('./container/User/UseHomePage', () => () => <div>UserHomePage</div>);
jest.mock('./container/Order/OrderHomePage', () => () => <div>OrderHomePage</div>);
jest.mock('./container/Header/TopMenu', () => () => <div>TopMenu</div>);
jest.mock('./container/User/PaymentSuccess', () => () => <div>PaymentSuccess</div>);
jest.mock('./container/Order/VnpayPaymentPage', () => () => <div>VnpayPaymentPage</div>);
jest.mock('./container/Order/VnpayPaymentSuccess', () => () => <div>VnpayPaymentSuccess</div>);
jest.mock('./container/About/AboutPage', () => () => <div>AboutPage</div>);

describe('App routing smoke', () => {
  it('renders the home route (/) with header, homepage, footer', () => {
    window.history.pushState({}, 'Home', '/');
    render(<App />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
