import { noop } from 'lodash';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

import { PersistLogin } from './auth';
import { Carousel } from './components/Carousel';
import { Footer, Header } from './components/Common';
import { Comment } from './components/Dev';
import { NotFound } from './components/Fallback';
import { MapView } from './components/Map';
import { UploadMultipleImages } from './components/UploadMultipleImages/UploadMultipleImages';
import {
  About,
  Contact,
  Contract,
  CreateWarehouse,
  Help,
  Home,
  Login,
  MyWarehouse,
  RentingForm,
  SignUp,
  UploadImageButton,
  WarehouseDetails,
} from './containers';
import { Role } from './enums/role.enum';
import { AuthGuard, RentedWarehouseGuard } from './guard';
import { WarehouseGuard } from './guard/WarehouseGuard';
import { RentingWarehouseResolver, WarehouseResolver } from './resolver';

const GlobalStyle = createGlobalStyle`
    body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        margin: 0;
    }
`;

const AppLayout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const BackgroundWrapper = styled.div`
  background-color: #eee;
  padding: 16px 0;
  flex: 1;
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1260px;
  margin: 0 auto 32px;
  background-color: white;
  border-radius: 8px;
  box-sizing: border-box;

  @media (max-width: 720px) {
    padding: 12px;
    margin-bottom: 16px;
    border-radius: 6px;
  }
`;

// RootWrapper handles the app chrome (header/footer) and a centered content wrapper.
// Placing the Outlet inside ensures a consistent app frame for most routes.
const RootWrapper = () => {
  return (
    <AppLayout>
      <Header></Header>
      <BackgroundWrapper>
        <Wrapper>
          <Outlet />
        </Wrapper>
      </BackgroundWrapper>
      <Footer />
    </AppLayout>
  );
};

// Top-level router config: applies persistence, guards and data resolvers.
// - PersistLogin sets up auth state before protected routes are evaluated.
// - Resolvers (WarehouseResolver, RentingWarehouseResolver) load model data for nested routes.
export const AppRouter = () => {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route element={<PersistLogin />} path="/*">
            <Route element={<RootWrapper />}>
              <Route element={<Home />} path="" />
              <Route element={<Home />} path="home" />
              <Route element={<About />} path="about" />
              <Route element={<AuthGuard />}>
                <Route element={<MyWarehouse />} path="list" />
              </Route>
              <Route element={<WarehouseResolver />} path="warehouse/:id/*">
                <Route element={<WarehouseGuard />}>
                  <Route element={<RentedWarehouseGuard />}>
                    <Route element={<WarehouseDetails />} path="" />
                    <Route element={<AuthGuard />}>
                      <Route element={<RentingWarehouseResolver />}>
                        <Route element={<RentingForm />} path="renting" />
                      </Route>
                      <Route element={<Contract />} path="contract"></Route>
                    </Route>
                  </Route>
                </Route>
              </Route>
              <Route element={<AuthGuard requireRoles={[Role.Owner]} />}>
                <Route element={<CreateWarehouse />} path="create" />
              </Route>
              <Route element={<Contact />} path="contact" />
              <Route element={<Help />} path="help" />
            </Route>
          </Route>
          <Route element={<RootWrapper />} path="/*">
            <Route element={<Login />} path="login" />
            <Route element={<SignUp />} path="sign-up" />
            <Route element={<NotFound />} path="*" />
          </Route>
          <Route path="dev/*">
            <Route element={<UploadImageButton onImageUploaded={noop} />} path="upload" />
            <Route
              element={
                <MapView
                  location={{
                    lat: 16.02298393469663,
                    lng: 108.1880701495974,
                  }}
                />
              }
              path="map-view"
            ></Route>
            <Route element={<Contract />} path="contract"></Route>

            <Route element={<Comment />} path="comment"></Route>
            <Route
              element={
                <Carousel
                  images={[
                    {
                      originalUrl:
                        'https://res.cloudinary.com/dy6dehxix/image/upload/v1695041166/u9dygkim3lz4zrj6wgqs.jpg',
                      thumbnailUrl:
                        'https://res.cloudinary.com/dy6dehxix/image/upload/c_limit,h_60,w_90/v1695041166/u9dygkim3lz4zrj6wgqs.jpg',
                    },
                    {
                      originalUrl:
                        'https://res.cloudinary.com/dy6dehxix/image/upload/v1695041166/zwyed3akqnlrknoanlah.jpg',
                      thumbnailUrl:
                        'https://res.cloudinary.com/dy6dehxix/image/upload/c_limit,h_60,w_90/v1695041166/zwyed3akqnlrknoanlah.jpg',
                    },
                  ]}
                />
              }
              path="carousel"
            ></Route>
            <Route element={<UploadMultipleImages />} path="upload-images"></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};
